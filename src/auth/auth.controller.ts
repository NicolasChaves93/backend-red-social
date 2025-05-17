import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthService } from './auth.service';
import { ApiError } from '../shared/errors/api-error';
import { LoginInput, RegisterInput } from './auth.schema';

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

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Autentica a un usuario y devuelve un token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error interno del servidor
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const credentials: LoginInput = loginSchema.parse(req.body);
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

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     description: Crea una nueva cuenta de usuario y devuelve un token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Datos de entrada inválidos
 *       409:
 *         description: El email o nombre de usuario ya existe
 *       500:
 *         description: Error interno del servidor
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    try {
      registerSchema.parse(req.body);
    } catch (validationError) {
      return next(new ApiError('Error de validación en los datos', 400, 
        validationError instanceof z.ZodError ? validationError.errors : []));
    }
    
    const userData: RegisterInput = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      fullName: req.body.fullName ?? ''
    };
    
    const result = await authService.register(userData);
    
    res.status(201).json({
      success: true,
      message: 'Usuario registrado con éxito',
      ...result
    });
  } catch (error) {
    next(error);
  }
};