import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { UpdateProfileInput } from './user.schema';
import { ApiError } from '../shared/errors/api-error';

const userService = new UserService();

/**
 * @openapi
 * /api/users/profile:
 *   get:
 *     summary: Obtener perfil del usuario actual
 *     description: Obtiene los datos del perfil del usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario obtenido con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: No autorizado, token inválido
 *       500:
 *         description: Error interno del servidor
 */
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Verificar si el usuario está autenticado
    if (!req.user) {
      throw new ApiError('Usuario no autenticado', 401);
    }
    
    const userId = req.user.id;
    const userEmail = req.user.email;
    
    const profile = await userService.getUserProfile(userId, userId);
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Obtener perfil de usuario por ID
 *     description: Obtiene los datos del perfil de un usuario específico por su ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Perfil del usuario obtenido con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: No autorizado, token inválido
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Verificar si el usuario está autenticado
    if (!req.user) {
      throw new ApiError('Usuario no autenticado', 401);
    }
    
    const { id } = req.params;
    const profile = await userService.getUserProfile(id, req.user.id);
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

/**
 * @openapi
 * /api/users/profile:
 *   put:
 *     summary: Actualizar perfil de usuario
 *     description: Actualiza los datos del perfil del usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileInput'
 *     responses:
 *       200:
 *         description: Perfil actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Perfil actualizado exitosamente
 *                 data:
 *                   $ref: '#/components/schemas/UserProfile'
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado, token inválido
 *       500:
 *         description: Error interno del servidor
 */
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Verificar si el usuario está autenticado
    if (!req.user) {
      throw new ApiError('Usuario no autenticado', 401);
    }
    
    const userId = req.user.id;
    const updateData: UpdateProfileInput = req.body;
    const profile = await userService.updateProfile(userId, updateData);
    
    res.status(200).json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: profile
    });
  } catch (error) {
    next(error);
  }
};