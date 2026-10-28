import { Sequelize } from 'sequelize';
import { logger } from '../logger';
import { settings } from './settings';

export const sequelize = new Sequelize(
  settings.database.name,
  settings.database.user,
  settings.database.pass,
  {
    host: settings.database.host,
    port: settings.database.port,
    dialect: 'postgres',
    logging: settings.logger.dbLogging
      ? (sql: string, timing?: number) => {
          logger.debug({ sql, timing }, 'Sequelize Query');
        }
      : false,
  }
);

export default sequelize;
