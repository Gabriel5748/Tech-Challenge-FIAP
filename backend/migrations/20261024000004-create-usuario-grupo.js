'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('usuario_grupo', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      usuario_fk: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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

    // Adiciona índice único para evitar duplicidade de usuário no mesmo grupo
    await queryInterface.addIndex('usuario_grupo', ['usuario_fk', 'grupo_fk'], {
      unique: true,
      name: 'idx_usuario_grupo_unique',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('usuario_grupo');
  },
};
