import { Request } from 'express';

// Define what the user property should look like
export interface UserPayload {
  id: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}
