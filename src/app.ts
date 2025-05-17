import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dataSource from '../ormconfig';
import { authRouter } from './auth/auth.router';
import { postsRouter } from './posts/posts.router';
import { userRouter } from './user/user.router';
import { seedDatabase } from './db/seed';
import { errorHandler } from './shared/middleware/error.middleware';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    database: dataSource.isInitialized ? 'connected' : 'disconnected'
  });
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/posts', postsRouter);
app.use('/api/users', userRouter);

// 404 Not Found
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.url}`
  });
});

// Error handler
app.use(errorHandler);

// Inicializar la base de datos y el servidor
async function bootstrap() {
  try {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
      console.log('Conexion exitosa a la base de datos');
      
      if (process.env.NODE_ENV !== 'production') {
        await seedDatabase();
      }
    }
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('No se pudo realizar conexion a la base de datos:', error);
    process.exit(1);
  }
}

bootstrap();

export default app;
