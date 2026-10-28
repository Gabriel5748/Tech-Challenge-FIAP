"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
var database_1 = require("../../infrastructure/frameworks/database");
Object.defineProperty(exports, "sequelize", { enumerable: true, get: function () { return database_1.sequelize; } });
const database_2 = require("../../infrastructure/frameworks/database");
exports.default = database_2.sequelize;
