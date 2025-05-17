import { Request, Response, NextFunction } from 'express';
import dataSource from '../../ormconfig';
import { User } from './user.entity';
import { Post } from '../posts/post.entity';
import { ApiError } from '../shared/errors/api-error';

// Get repository functions
const getUserRepository = () => {
  if (!dataSource.isInitialized) {
    throw new Error('Database connection not initialized');
  }
  return dataSource.getRepository(User);
};

const getPostRepository = () => {
  if (!dataSource.isInitialized) {
    throw new Error('Database connection not initialized');
  }
  return dataSource.getRepository(Post);
};

// Get current user profile
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userRepository = getUserRepository();
    const postRepository = getPostRepository();
    
    const user = await userRepository.findOneBy({ id: req.user.id });
    
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    
    // Get user posts
    const posts = await postRepository.find({
      where: { author: { id: user.id } },
      relations: ['likes'],
      order: { createdAt: 'DESC' }
    });
    
    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        bio: user.bio,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
        posts: posts.map(post => ({
          id: post.id,
          content: post.content,
          imageUrl: post.imageUrl,
          likesCount: post.likesCount,
          createdAt: post.createdAt,
          liked: post.likes?.some(likeUser => likeUser.id === req.user.id) || false
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get user profile by ID
export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const userRepository = getUserRepository();
    const postRepository = getPostRepository();
    
    const user = await userRepository.findOneBy({ id });
    
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    
    // Get user posts
    const posts = await postRepository.find({
      where: { author: { id: user.id } },
      relations: ['likes'],
      order: { createdAt: 'DESC' }
    });
    
    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        bio: user.bio,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
        posts: posts.map(post => ({
          id: post.id,
          content: post.content,
          imageUrl: post.imageUrl,
          likesCount: post.likesCount,
          createdAt: post.createdAt,
          liked: post.likes?.some(likeUser => likeUser.id === req.user.id) || false
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fullName, bio, profilePicture } = req.body;
    
    const userRepository = getUserRepository();
    
    const user = await userRepository.findOneBy({ id: req.user.id });
    
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    
    // Update only provided fields
    if (fullName !== undefined) user.fullName = fullName;
    if (bio !== undefined) user.bio = bio;
    if (profilePicture !== undefined) user.profilePicture = profilePicture;
    
    await userRepository.save(user);
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        bio: user.bio,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    next(error);
  }
};
