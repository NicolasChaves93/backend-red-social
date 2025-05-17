import { Router } from 'express';
import { login, register } from './auth.controller';
import { validateRequest } from '../shared/middleware/validation.middleware';

export const authRouter = Router();

// Validation rules
const loginValidation = [
  { field: 'email', required: true, type: 'string' },
  { field: 'password', required: true, type: 'string' }
];

const registerValidation = [
  { field: 'username', required: true, type: 'string', minLength: 3, maxLength: 30 },
  { field: 'email', required: true, type: 'string' },
  { field: 'password', required: true, type: 'string', minLength: 6 },
  { field: 'fullName', required: false, type: 'string' }
];

// Routes
authRouter.post('/login', validateRequest(loginValidation), login);
authRouter.post('/register', validateRequest(registerValidation), register);
