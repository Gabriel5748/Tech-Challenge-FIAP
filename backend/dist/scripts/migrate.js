"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../infrastructure/frameworks/database");
require("../src/core/models");
async function runMigration() {
    try {
        console.log('Conectando ao banco de dados...');
        await database_1.sequelize.authenticate();
        console.log('Conexão estabelecida com sucesso.');
        console.log('Recomendado: utilize as migrações oficiais com "npm run db:migrate" (Sequelize CLI).');
        console.log('Sincronizando tabelas via Sequelize como fallback seguro...');
        await database_1.sequelize.sync({ alter: true });
        console.log('Tabelas verificadas e sincronizadas com sucesso!');
        process.exit(0);
    }
    catch (error) {
        console.error('Erro durante a sincronização:', error);
        process.exit(1);
    }
}
runMigration();
