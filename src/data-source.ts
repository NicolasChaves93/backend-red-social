import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno
dotenv.config();

// Crear y exportar la fuente de datos
const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'social_network',
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
  entities: [path.join(__dirname, '**/*.entity.{ts,js}')],
  migrations: [path.join(__dirname, 'db/migrations/**/*.{ts,js}')],
  subscribers: [path.join(__dirname, 'db/subscribers/**/*.{ts,js}')]
});

export default dataSource;
