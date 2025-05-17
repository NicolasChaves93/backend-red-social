import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dataSource from './data-source';
import { authRouter } from './auth/auth.router';
import { postsRouter } from './posts/posts.router';
import { userRouter } from './user/user.router';
import { seedDatabase } from './db/seed';
import { errorHandler } from './shared/middleware/error.middleware';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;
const MAX_RETRIES = 3;
let retries = 0;

// Middlewares
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    database: dataSource.isInitialized ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV ?? 'development'
  });
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/posts', postsRouter);
app.use('/api/users', userRouter);

// 404 Not Found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.url}`
  });
});

// Error handler
app.use(errorHandler);

// Inicializar la base de datos y el servidor con reintentos
const connectWithRetry = async () => {
  try {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
      console.log('Conexión exitosa a la base de datos');

      if (process.env.NODE_ENV !== 'production') {
        await seedDatabase();
      }
    }

    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en el puerto ${PORT}`);
    });
  } catch (error: unknown) {
    const err = error as Error;

    retries++;
    if (retries > MAX_RETRIES) {
      console.error('No se pudo conectar a la base de datos después de varios intentos.');
      console.error('Detalle del error:', err.message);
      process.exit(1);
    }
    console.warn(`Reintentando conexión a la base de datos (${retries}/${MAX_RETRIES})...`);
    setTimeout(connectWithRetry, 5000);
  }
};

connectWithRetry();

export default app;