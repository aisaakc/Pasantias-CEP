import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 3001;

export const DB_CONFIG = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
};

export const JWT_SECRET = process.env.JWT_SECRET;