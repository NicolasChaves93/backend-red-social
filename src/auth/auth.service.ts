import bcrypt from 'bcryptjs';
import { User } from '../user/user.entity';
import { getRepository } from '../shared/utils/repository.util';
import { ApiError } from '../shared/errors/api-error';
import { generateToken } from '../shared/utils/jwt.util';

export interface RegisterUserDto {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export class AuthService {
  async register(userData: RegisterUserDto) {
    try {
      const userRepo = getRepository(User);
      
      // Verificar si el usuario ya existe
      const existingEmail = await userRepo.findOneBy({ email: userData.email });
      const existingUsername = await userRepo.findOneBy({ username: userData.username });
      
      if (existingEmail) {
        throw new ApiError('El email ya está registrado', 409);
      }
      
      if (existingUsername) {
        throw new ApiError('El nombre de usuario ya está registrado', 409);
      }

      // Crear usuario
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const newUser = userRepo.create({
        ...userData,
        password: hashedPassword,
        bio: '',
        profilePicture: '',
        fullName: userData.fullName ?? ''
      });

      const user = await userRepo.save(newUser);
      const token = generateToken(user);

      return {
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        token
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error('Error en el registro de usuario:', error);
      throw new ApiError('Error al registrar el usuario', 500);
    }
  }

  async login(credentials: LoginUserDto) {
    try {
      const userRepo = getRepository(User);

      const user = await userRepo.findOneBy({ email: credentials.email });
      if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
        throw new ApiError('Email o contraseña inválidos', 401);
      }

      const token = generateToken(user);

      return {
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        token
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error('Error en el login:', error);
      throw new ApiError('Error al iniciar sesión', 500);
    }
  }
}
