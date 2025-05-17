import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import dataSource from '../../ormconfig';
import { User } from '../user/user.entity';
import { ApiError } from '../shared/errors/api-error';
import { generateToken } from '../shared/utils/jwt.util';

const getUserRepository = () => {
  if (!dataSource.isInitialized) throw new Error('Base de datos no inicializada');
  return dataSource.getRepository(User);
};

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

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const userRepo = getUserRepository();

    const user = await userRepo.findOneBy({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new ApiError('Email o contraseña inválidos', 401);
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
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
    
    const { username, email, password, fullName } = req.body;
    const userRepo = getUserRepository();

    // Verificar si el email o username ya existen (búsqueda optimizada)
    const existingUser = await userRepo.findOne({
      where: [{ email }, { username }],
      select: ['id', 'email', 'username']
    });
    
    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'nombre de usuario';
      throw new ApiError(`El ${field} ya está registrado`, 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = userRepo.create({
      username,
      email,
      password: hashedPassword,
      fullName,
      bio: '',
      profilePicture: ''
    });

    const user = await userRepo.save(newUser);
    
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado con éxito',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
};