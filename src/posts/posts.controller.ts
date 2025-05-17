import { Request, Response, NextFunction } from 'express';
import { PostsService } from './posts.service';

const postsService = new PostsService();

// Get all posts
export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await postsService.getAllPosts(req.user.id);
    
    res.status(200).json({
      success: true,
      data: posts
    });
  } catch (error) {
    next(error);
  }
};

// Create a post
export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await postsService.createPost(req.user.id, req.body);
    
    res.status(201).json({
      success: true,
      message: 'Post creado exitosamente',
      data: post
    });
  } catch (error) {
    next(error);
  }
};

// Like a post
export const likePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await postsService.toggleLike(id, req.user.id);
    
    res.status(200).json({
      success: true,
      message: result.liked ? 'Post likeado exitosamente' : 'Like eliminado exitosamente',
      ...result
    });
  } catch (error) {
    next(error);
  }
};
