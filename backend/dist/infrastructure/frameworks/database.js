"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
// src/infrastructure/frameworks/database.ts
const sequelize_1 = require("sequelize");
const settings_1 = require("./settings");
exports.sequelize = new sequelize_1.Sequelize(settings_1.settings.database.name, settings_1.settings.database.user, settings_1.settings.database.pass, {
    host: settings_1.settings.database.host,
    port: settings_1.settings.database.port,
    dialect: 'postgres',
    logging: false,
});
exports.default = exports.sequelize;
