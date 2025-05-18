import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../errors/api-error';
import { AuthRequest } from '../interfaces/request.interface';

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
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
      
      // Asegurarnos de que el objeto decoded tenga las propiedades requeridas
      if (typeof decoded === 'object' && decoded !== null && 'id' in decoded) {
        // Verificar que email esté definido, si se requiere como no opcional
        if (!decoded.email) {
          throw new ApiError('Invalid token payload', 401);
        }
        
        // Asignar explícitamente las propiedades necesarias
        req.user = {
          id: decoded.id as string,
          email: decoded.email as string,
          username: decoded.username as string | undefined
        } as any;
        next();
      } else {
        throw new ApiError('Invalid token payload structure', 401);
      }
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

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Your authentication logic
  // ...
  
  // When setting the user, TypeScript will now recognize it
  req.user = {
    id: 'user-id',
    email: 'user@example.com',
    // other properties
  };
  
  next();
};
