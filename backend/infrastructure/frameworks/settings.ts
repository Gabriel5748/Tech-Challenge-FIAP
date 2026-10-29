// src/infrastructure/frameworks/settings.ts
import * as dotenv from 'dotenv';

dotenv.config();

export const settings = {
  app: {
    host: process.env.API_HOST || '',
    port: process.env.API_PORT ? Number(process.env.API_PORT) : 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    allowedHosts: process.env.ALLOWED_HOSTS || '',
  },
  database: {
    host: process.env.DB_HOST || '',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    name: (process.env.NODE_ENV === 'test' ? process.env.DB_NAME_TEST : process.env.DB_NAME) || '',
    user: process.env.DB_USER || '',
    pass: process.env.DB_PASSWORD || '',
  },
  logger: {
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
    dir: process.env.LOG_DIR || 'logs',
    dbLogging: process.env.LOG_DB_QUERIES === 'true',
  },
};
export default settings;
