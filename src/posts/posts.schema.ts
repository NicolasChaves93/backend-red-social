/**
 * @openapi
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Identificador único de la publicación
 *         content:
 *           type: string
 *           description: Contenido de la publicación
 *         imageUrl:
 *           type: string
 *           nullable: true
 *           description: URL de la imagen adjunta a la publicación
 *         likesCount:
 *           type: integer
 *           description: Cantidad de "me gusta" en la publicación
 *         author:
 *           $ref: '#/components/schemas/PostAuthor'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación de la publicación
 *         liked:
 *           type: boolean
 *           description: Indica si el usuario actual ha dado "me gusta" a la publicación
 *       required:
 *         - id
 *         - content
 *         - author
 *         - createdAt
 *     
 *     PostAuthor:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Identificador único del autor
 *         username:
 *           type: string
 *           description: Nombre de usuario del autor
 *         profilePicture:
 *           type: string
 *           nullable: true
 *           description: URL a la imagen de perfil del autor
 *       required:
 *         - id
 *         - username
 *     
 *     CreatePostInput:
 *       type: object
 *       properties:
 *         content:
 *           type: string
 *           description: Contenido de la publicación
 *         imageUrl:
 *           type: string
 *           nullable: true
 *           description: URL de la imagen adjunta a la publicación
 *       required:
 *         - content
 *     
 *     LikeResponse:
 *       type: object
 *       properties:
 *         liked:
 *           type: boolean
 *           description: Estado del "me gusta" (true = le gusta, false = no le gusta)
 *         likesCount:
 *           type: integer
 *           description: Cantidad actualizada de "me gusta" en la publicación
 */

export interface Post {
  id: string;
  content: string;
  imageUrl?: string;
  likesCount: number;
  author: PostAuthor;
  createdAt: Date;
  liked: boolean;
}

export interface PostAuthor {
  id: string;
  username: string;
  profilePicture?: string;
}

export interface CreatePostInput {
  content: string;
  imageUrl?: string;
}

export interface LikeResponse {
  liked: boolean;
  likesCount: number;
}
