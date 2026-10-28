'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('carga_quimica');
    if (!tableInfo.codigo) {
      await queryInterface.addColumn('carga_quimica', 'codigo', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    const tableInfo = await queryInterface.describeTable('carga_quimica');
    if (tableInfo.codigo) {
      await queryInterface.removeColumn('carga_quimica', 'codigo');
    }
  },
};
