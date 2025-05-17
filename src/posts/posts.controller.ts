import { Request, Response, NextFunction } from 'express';
import { PostsService } from './posts.service';
import { CreatePostInput } from './posts.schema';

const postsService = new PostsService();

/**
 * @openapi
 * /api/posts:
 *   get:
 *     summary: Obtener todas las publicaciones
 *     description: Retorna todas las publicaciones ordenadas por fecha de creación
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de publicaciones obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *       401:
 *         description: No autorizado, token inválido
 *       500:
 *         description: Error interno del servidor
 */
export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await postsService.getAllPosts(req.user.id);
    
    res.status(200).json({
      success: true,
      data: posts
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @openapi
 * /api/posts:
 *   post:
 *     summary: Crear una nueva publicación
 *     description: Crea una nueva publicación con el usuario autenticado como autor
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostInput'
 *     responses:
 *       201:
 *         description: Publicación creada exitosamente
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
 *                   example: Post creado exitosamente
 *                 data:
 *                   $ref: '#/components/schemas/Post'
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado, token inválido
 *       500:
 *         description: Error interno del servidor
 */
export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postData: CreatePostInput = req.body;
    const post = await postsService.createPost(req.user.id, postData);
    
    res.status(201).json({
      success: true,
      message: 'Post creado exitosamente',
      data: post
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @openapi
 * /api/posts/{id}/like:
 *   post:
 *     summary: Dar o quitar "me gusta" a una publicación
 *     description: Alterna el estado de "me gusta" de una publicación para el usuario autenticado
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la publicación
 *     responses:
 *       200:
 *         description: Estado de "me gusta" actualizado exitosamente
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
 *                   example: Post likeado exitosamente
 *                 liked:
 *                   type: boolean
 *                 likesCount:
 *                   type: integer
 *       401:
 *         description: No autorizado, token inválido
 *       404:
 *         description: Publicación no encontrada
 *       500:
 *         description: Error interno del servidor
 */
export const likePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await postsService.toggleLike(id, req.user.id);
    
    res.status(200).json({
      success: true,
      message: result.liked ? 'Post likeado exitosamente' : 'Like eliminado exitosamente',
      ...result
    });
  } catch (error) {
    next(error);
  }
};
