import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthService } from './auth.service';
import { ApiError } from '../shared/errors/api-error';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(3)
});

const authService = new AuthService();

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const credentials = loginSchema.parse(req.body);
    const result = await authService.login(credentials);
    
    res.status(200).json({
      success: true,
      message: 'Login exitoso',
      ...result
    });
  } catch (error) {
    next(error);
  }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validar entrada con manejo de errores mejorado
    try {
      registerSchema.parse(req.body);
    } catch (validationError) {
      return next(new ApiError('Error de validación en los datos', 400, 
        validationError instanceof z.ZodError ? validationError.errors : []));
    }
    
    const result = await authService.register(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Usuario registrado con éxito',
      ...result
    });
  } catch (error) {
    next(error);
  }
};