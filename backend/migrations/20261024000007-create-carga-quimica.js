'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('carga_quimica', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      formula: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      produto_quimico_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'produto_quimico',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      quantidade: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      unidade_medida: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      origem: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      destino: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      responsavel_tecnico: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      documentacao_obrigatoria: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'pendente',
      },
      data_entrada: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('carga_quimica');
  },
};
