// src/infrastructure/frameworks/database.ts
import { Sequelize } from 'sequelize';
import { settings } from './settings';

export const sequelize = new Sequelize(
  settings.database.name,
  settings.database.user,
  settings.database.pass,
  {
    host: settings.database.host,
    port: settings.database.port,
    logging: false,
  }
);