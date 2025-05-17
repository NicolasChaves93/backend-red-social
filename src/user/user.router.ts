import { Router } from 'express';
import { getProfile, getUserProfile, updateProfile } from './user.controller';
import { authenticate } from '../shared/middleware/auth.middleware';

export const userRouter = Router();

// Protected routes
userRouter.use(authenticate);

// Routes
userRouter.get('/profile', getProfile);
userRouter.get('/:id', getUserProfile);
userRouter.put('/profile', updateProfile);
