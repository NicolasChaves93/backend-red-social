import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../errors/api-error';

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        username?: string;
        email?: string;
      };
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      throw new ApiError('No token provided', 401);
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      throw new ApiError('No token provided', 401);
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET ?? 'supersecretkey123456789');
      req.user = decoded as { id: string; username?: string; email?: string };
      next();
    } catch (error) {
      if (error && typeof error === 'object' && 'name' in error) {
        if ((error as { name: string }).name === 'JsonWebTokenError') {
          throw new ApiError('Invalid token', 401);
        } else if ((error as { name: string }).name === 'TokenExpiredError') {
          throw new ApiError('Token expired', 401);
        }
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};
