/**
 * @openapi
 * components:
 *   schemas:
 *     LoginInput:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del usuario
 *           example: usuario@ejemplo.com
 *         password:
 *           type: string
 *           format: password
 *           description: Contraseña del usuario
 *           example: contraseña123
 *       required:
 *         - email
 *         - password
 *     
 *     RegisterInput:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: Nombre de usuario único
 *           example: usuario_ejemplo
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del usuario
 *           example: usuario@ejemplo.com
 *         password:
 *           type: string
 *           format: password
 *           description: Contraseña del usuario (mínimo 6 caracteres)
 *           example: contraseña123
 *         fullName:
 *           type: string
 *           description: Nombre completo del usuario
 *           example: Usuario Ejemplo
 *       required:
 *         - username
 *         - email
 *         - password
 *         - fullName
 *     
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Operación exitosa
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               description: Identificador único del usuario
 *               example: 550e8400-e29b-41d4-a716-446655440000
 *             username:
 *               type: string
 *               description: Nombre de usuario único
 *               example: usuario_ejemplo
 *             email:
 *               type: string
 *               format: email
 *               description: Correo electrónico del usuario
 *               example: usuario@ejemplo.com
 *         token:
 *           type: string
 *           description: Token JWT para autenticación
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
  token: string;
}
