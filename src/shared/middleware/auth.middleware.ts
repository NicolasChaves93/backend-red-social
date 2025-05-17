import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../errors/api-error';

// Extend Express Request to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
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
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey123456789');
      req.user = decoded;
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new ApiError('Invalid token', 401);
      } else if (error.name === 'TokenExpiredError') {
        throw new ApiError('Token expired', 401);
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};
