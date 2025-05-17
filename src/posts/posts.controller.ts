import { Request, Response, NextFunction } from 'express';
import dataSource from '../../ormconfig';
import { Post } from './post.entity';
import { User } from '../user/user.entity';
import { ApiError } from '../shared/errors/api-error';

// Get repository functions
const getPostRepository = () => {
  if (!dataSource.isInitialized) {
    throw new Error('Database connection not initialized');
  }
  return dataSource.getRepository(Post);
};

const getUserRepository = () => {
  if (!dataSource.isInitialized) {
    throw new Error('Database connection not initialized');
  }
  return dataSource.getRepository(User);
};

// Get all posts
export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postRepository = getPostRepository();
    
    const posts = await postRepository.find({
      relations: ['author', 'likes'],
      order: {
        createdAt: 'DESC'
      }
    });
    
    // Transform posts to remove sensitive data
    const transformedPosts = posts.map(post => ({
      id: post.id,
      content: post.content,
      imageUrl: post.imageUrl,
      likesCount: post.likesCount,
      createdAt: post.createdAt,
      author: {
        id: post.author.id,
        username: post.author.username,
        profilePicture: post.author.profilePicture
      },
      liked: post.likes?.some(user => user.id === req.user.id) || false
    }));
    
    res.status(200).json({
      success: true,
      data: transformedPosts
    });
  } catch (error) {
    next(error);
  }
};

// Create a post
export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content, imageUrl } = req.body;
    
    if (!content) {
      throw new ApiError('Content is required', 400);
    }
    
    const userRepository = getUserRepository();
    const postRepository = getPostRepository();
    
    const user = await userRepository.findOneBy({ id: req.user.id });
    
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    
    const post = postRepository.create({
      content,
      imageUrl,
      author: user,
      likes: [],
      likesCount: 0
    });
    
    await postRepository.save(post);
    
    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: {
        id: post.id,
        content: post.content,
        imageUrl: post.imageUrl,
        createdAt: post.createdAt,
        likesCount: post.likesCount,
        author: {
          id: user.id,
          username: user.username,
          profilePicture: user.profilePicture
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Like a post
export const likePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const postRepository = getPostRepository();
    const userRepository = getUserRepository();
    
    const post = await postRepository.findOne({
      where: { id },
      relations: ['likes']
    });
    
    if (!post) {
      throw new ApiError('Post not found', 404);
    }
    
    const user = await userRepository.findOneBy({ id: req.user.id });
    
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    
    // Initialize likes array if undefined
    if (!post.likes) {
      post.likes = [];
    }
    
    // Check if user already liked the post
    const alreadyLiked = post.likes.some(likeUser => likeUser.id === user.id);
    
    if (alreadyLiked) {
      // Unlike the post
      post.likes = post.likes.filter(likeUser => likeUser.id !== user.id);
      post.likesCount = post.likes.length;
      await postRepository.save(post);
      
      res.status(200).json({
        success: true,
        message: 'Post unliked successfully',
        liked: false,
        likesCount: post.likesCount
      });
    } else {
      // Like the post
      post.likes.push(user);
      post.likesCount = post.likes.length;
      await postRepository.save(post);
      
      res.status(200).json({
        success: true,
        message: 'Post liked successfully',
        liked: true,
        likesCount: post.likesCount
      });
    }
  } catch (error) {
    next(error);
  }
};
