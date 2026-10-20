import sequelize from './domain/database'
import './domain/entities/models';

async function runMigration() {
  try {
    console.log('Conectando ao banco de dados...');
    await sequelize.authenticate();
    console.log('Conexão estabelecida com sucesso.');

    console.log('Gerando e sincronizando tabelas no banco de dados...');

    await sequelize.sync({ alter: true });
    
    console.log('Migração concluída com sucesso! Todas as tabelas do QuimiPort foram criadas/atualizadas.');
    process.exit(0);
  } catch (error) {
    console.error('Erro durante a execução da migração:', error);
    process.exit(1);
  }
}

runMigration();