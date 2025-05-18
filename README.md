# Red Social API – Arquitectura de Microservicios

Este proyecto implementa una API RESTful robusta para una aplicación de red social, construida con arquitectura de microservicios utilizando **Node.js**, **Express**, **TypeORM** y **PostgreSQL**. El backend está diseñado para ser escalable, modular y seguir buenas prácticas de desarrollo moderno.

---

## 🚀 Funcionalidades principales

- Autenticación de usuarios (registro e inicio de sesión con JWT)
- Gestión de perfiles de usuario
- Creación y visualización de publicaciones
- Like/Unlike a publicaciones
- Feed de publicaciones
- Seeder de base de datos con datos de prueba
- Manejo de errores estructurado y validación con `zod`

---

## 🗂️ Estructura del proyecto

```
backend-red-social/
├── src/
│   ├── __tests__/                      # Carpeta de pruebas (vacía o para test unitarios)
│
│   ├── auth/                           # Módulo de autenticación
│   │   ├── auth.controller.ts          # Controlador de autenticación
│   │   ├── auth.router.ts              # Definición de rutas de auth
│   │   ├── auth.schema.ts              # Validaciones con Zod
│   │   └── auth.service.ts             # Lógica de negocio (login, registro)
│
│   ├── config/
│   │   └── swagger.config.ts           # Configuración para la documentación Swagger
│
│   ├── db/
│   │   └── seed.ts                     # Seeder de base de datos
│
│   ├── posts/                          # Módulo de publicaciones
│   │   ├── post.entity.ts              # Entidad de publicación (Post)
│   │   ├── posts.controller.ts         # Controlador de publicaciones
│   │   ├── posts.router.ts             # Rutas de publicaciones
│   │   ├── posts.schema.ts             # Validaciones de publicación
│   │   └── posts.service.ts            # Lógica de negocio de publicaciones
│
│   ├── shared/                         # Código reutilizable global
│   │   ├── errors/
│   │   │   └── api-error.ts            # Clase de error personalizada
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts      # Middleware JWT
│   │   │   ├── error.middleware.ts     # Manejo de errores globales
│   │   │   └── validation.middleware.ts# Validación con Zod
│   │   ├── types/
│   │   │   └── express.d.ts            # Tipos extendidos de Express
│   │   └── utils/
│   │       ├── jwt.util.ts             # Utilidades para generar/verificar JWT
│   │       └── repository.util.ts      # Wrapper para consultas con TypeORM
│
│   ├── types/
│   │   ├── express/
│   │   │   └── index.d.ts              # Tipos para req.user, etc.
│   │   └── express.d.ts
│
│   ├── user/                           # Módulo de perfil de usuario
│   │   ├── user.controller.ts          # Controlador de perfil
│   │   ├── user.entity.ts              # Entidad User
│   │   ├── user.router.ts              # Rutas de perfil
│   │   ├── user.schema.ts              # Validaciones del perfil
│   │   └── user.service.ts             # Lógica del perfil
│
│   ├── app.ts                          # Punto de entrada de la aplicación
│   └── data-source.ts                  # Conexión y configuración de TypeORM
├── Dockerfile                          # Imagen del backend
├── docker-compose.yml                  # Orquestación de servicios
├── ormconfig.ts                        # Configuración TypeORM
├── .env                                # Variables de entorno
```

---

## 📦 Tecnologías utilizadas

- **Node.js** + **Express**
- **TypeORM** + **PostgreSQL**
- **JWT** para autenticación
- **Zod** para validaciones
- **Swagger** para documentación (`/api/docs`)
- **Winston** para logs
- **TypeScript** (estrict mode)

---

## 🛠️ Scripts útiles

| Comando           | Descripción                                  |
|-------------------|----------------------------------------------|
| `npm run dev`     | Inicia el servidor en modo desarrollo        |
| `npm run build`   | Transpila a JavaScript en `dist/`            |
| `npm start`       | Ejecuta el servidor desde `dist/`            |
| `npm run seed`    | Ejecuta el seeder de datos                   |
| `npm run test`    | Corre pruebas con Jest                       |
| `npm run lint`    | Ejecuta ESLint sobre los archivos del código |

---

## 🐳 Docker

```bash
docker-compose up --build
```

Levanta la base de datos PostgreSQL y el backend

Asegúrate de configurar correctamente tu archivo `.env`

---

## 📄 Documentación de la API

Documentación Swagger disponible en:
http://localhost:3000/api/docs

---

## Estado del proyecto

✅ Autenticación JWT  
✅ CRUD de publicaciones  
✅ Likes a publicaciones  
✅ Gestión de perfiles  
✅ Seeder inicial  
✅ Documentación Swagger

---

## Requisitos para desarrollo

- Node.js >= 18.x
- PostgreSQL >= 14
- Docker (opcional)

---

## 🚀 Primeros pasos

### Instalación

1. Clona el repositorio:
   ```
   git clone https://github.com/NicolasChaves93/backend-red-social.git
   cd backend-red-social
   ```

2. Instala las dependencias:
   ```
   npm install
   ```

3. Crea un archivo `.env` en el directorio raíz con el siguiente contenido:
   ```
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=tu_clave_secreta
   JWT_EXPIRES_IN=1d
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=tu_contraseña
   DB_NAME=red_social_db
   ```

4. Inicia la aplicación:
   ```
   npm run dev
   ```

### Usuarios de prueba

Después de ejecutar el seeder, puedes usar estas cuentas de prueba:

- Username: CarlosGomez, Email: carlos.gomez@example.com, Password: password123
  
- Username: TaniaMercedes, Email: tania.mercedes@example.com, Password: password123
  
- Username: AlexRemolina, Email: aleander.remolina@example.com, Password: password123

---

## 📝 API Endpoints

### Autenticación

- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión y obtener token JWT

### Publicaciones

- `GET /api/posts` - Obtener todas las publicaciones
- `POST /api/posts` - Crear una nueva publicación
- `POST /api/posts/:id/like` - Dar/quitar like a una publicación

### Usuarios

- `GET /api/users/profile` - Obtener perfil del usuario actual
- `GET /api/users/:id` - Obtener perfil de un usuario
- `PUT /api/users/profile` - Actualizar perfil del usuario actual

---

## 👥 Contribución

1. Haz fork del repositorio
2. Crea tu rama de funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. Haz commit de tus cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

---

## 🙏 Agradecimientos

- Al equipo de Express.js por el increíble framework
- A los contribuidores de TypeORM por el excelente ORM
- A todos los contribuidores de código abierto cuyas librerías hicieron posible este proyecto
