import { Router } from 'express';
import { createPost, getPosts, likePost } from './posts.controller';
import { authenticate } from '../shared/middleware/auth.middleware';

export const postsRouter = Router();

// Protected routes
postsRouter.use(authenticate);

// Routes
postsRouter.get('/', getPosts);
postsRouter.post('/', createPost);
postsRouter.post('/:id/like', likePost);
