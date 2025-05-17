import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../errors/api-error';

type ValidationRule = {
  field: string;
  required?: boolean;
  type?: string;
  minLength?: number;
  maxLength?: number;
};

export const validateRequest = (rules: ValidationRule[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors: string[] = [];
      
      for (const rule of rules) {
        const value = req.body[rule.field];
        
        // Check required fields
        if (rule.required && (value === undefined || value === null || value === '')) {
          errors.push(`${rule.field} is required`);
          continue;
        }
        
        // Skip validation for optional fields if not provided
        if (value === undefined || value === null) {
          continue;
        }
        
        // Check type
        if (rule.type && typeof value !== rule.type) {
          errors.push(`${rule.field} must be a ${rule.type}`);
        }
        
        // Check string length
        if (typeof value === 'string') {
          if (rule.minLength !== undefined && value.length < rule.minLength) {
            errors.push(`${rule.field} must be at least ${rule.minLength} characters`);
          }
          
          if (rule.maxLength !== undefined && value.length > rule.maxLength) {
            errors.push(`${rule.field} must be at most ${rule.maxLength} characters`);
          }
        }
      }
      
      if (errors.length > 0) {
        throw new ApiError('Validation failed', 400, errors);
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};
