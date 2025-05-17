/**
 * @openapi
 * components:
 *   schemas:
 *     UserProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Identificador único del usuario
 *         username:
 *           type: string
 *           description: Nombre de usuario único
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del usuario
 *         fullName:
 *           type: string
 *           description: Nombre completo del usuario
 *         bio:
 *           type: string
 *           nullable: true
 *           description: Biografía o descripción breve del usuario
 *         profilePicture:
 *           type: string
 *           nullable: true
 *           description: URL a la imagen de perfil del usuario
 *         posts:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PostSummary'
 *           description: Lista de publicaciones del usuario
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación de la cuenta
 *       required:
 *         - id
 *         - username
 *         - email
 *         - createdAt
 *     
 *     PostSummary:
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
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación de la publicación
 *         liked:
 *           type: boolean
 *           description: Indica si el usuario actual ha dado "me gusta" a la publicación
 *
 *     UpdateProfileInput:
 *       type: object
 *       properties:
 *         fullName:
 *           type: string
 *           description: Nombre completo del usuario
 *         bio:
 *           type: string
 *           description: Biografía o descripción breve del usuario
 *         profilePicture:
 *           type: string
 *           description: URL a la imagen de perfil del usuario
 */

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  bio?: string;
  profilePicture?: string;
  createdAt: Date;
  posts?: PostSummary[];
}

export interface PostSummary {
  id: string;
  content: string;
  imageUrl?: string;
  likesCount: number;
  createdAt: Date;
  liked: boolean;
}

export interface UpdateProfileInput {
  fullName?: string;
  bio?: string;
  profilePicture?: string;
}
