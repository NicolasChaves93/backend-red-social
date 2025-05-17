import jwt from 'jsonwebtoken';
import { User } from '../../user/user.entity';

// Asegura que siempre haya un secreto disponible
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('ERROR: JWT_SECRET no está configurado en las variables de entorno');
  }
  return secret;
};

export const generateToken = (user: User): string => {
  const payload = {
    id: user.id,
    email: user.email,
    username: user.username
  };
  
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '3h' });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, getJwtSecret());
};
