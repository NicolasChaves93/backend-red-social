import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';

const userService = new UserService();

// Get current user profile
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await userService.getUserProfile(req.user.id, req.user.id);
    
    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// Get user profile by ID
export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const profile = await userService.getUserProfile(id, req.user.id);
    
    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await userService.updateProfile(req.user.id, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: profile
    });
  } catch (error) {
    next(error);
  }
};
