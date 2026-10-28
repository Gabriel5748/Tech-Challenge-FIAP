"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
const settings_1 = require("../frameworks/settings");
exports.pool = new pg_1.Pool({
    host: settings_1.settings.database.host,
    port: settings_1.settings.database.port,
    database: settings_1.settings.database.name,
    user: settings_1.settings.database.user,
    password: settings_1.settings.database.pass,
});
