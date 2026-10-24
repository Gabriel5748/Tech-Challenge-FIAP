'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('grupo_permissao', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      grupo_fk: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'grupos',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      permissao_fk: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'permissoes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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

    // Adiciona índice único para evitar duplicidade de permissão no mesmo grupo
    await queryInterface.addIndex('grupo_permissao', ['grupo_fk', 'permissao_fk'], {
      unique: true,
      name: 'idx_grupo_permissao_unique',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('grupo_permissao');
  },
};
