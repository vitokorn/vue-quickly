'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Change deezer_id from INTEGER to BIGINT in Artists table
    await queryInterface.changeColumn('Artists', 'deezer_id', {
      type: Sequelize.BIGINT,
      allowNull: true
    });

    // Change deezer_id from INTEGER to BIGINT in Albums table
    await queryInterface.changeColumn('Albums', 'deezer_id', {
      type: Sequelize.BIGINT,
      allowNull: true
    });

    // Change deezer_id from INTEGER to BIGINT in Tracks table
    await queryInterface.changeColumn('Tracks', 'deezer_id', {
      type: Sequelize.BIGINT,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    // Revert deezer_id back to INTEGER in Artists table
    await queryInterface.changeColumn('Artists', 'deezer_id', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    // Revert deezer_id back to INTEGER in Albums table
    await queryInterface.changeColumn('Albums', 'deezer_id', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    // Revert deezer_id back to INTEGER in Tracks table
    await queryInterface.changeColumn('Tracks', 'deezer_id', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  }
};
