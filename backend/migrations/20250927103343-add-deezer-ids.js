'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Tracks', 'deezer_id', {
      type: Sequelize.INTEGER
    });
    await queryInterface.addColumn('Albums', 'deezer_id', {
      type: Sequelize.INTEGER
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Tracks', 'deezer_id');
    await queryInterface.removeColumn('Albums', 'deezer_id');
  }
};
