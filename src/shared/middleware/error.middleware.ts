import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../errors/api-error';

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors
    });
  }
  
  // Default error
  res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
};
