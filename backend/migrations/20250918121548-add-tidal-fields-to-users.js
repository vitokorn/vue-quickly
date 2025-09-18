'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add Tidal fields to Users table
    await queryInterface.addColumn('Users', 'tidal_id', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'tidal_access_token', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'tidal_refresh_token', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    // Remove Tidal fields from Users table
    await queryInterface.removeColumn('Users', 'tidal_id');
    await queryInterface.removeColumn('Users', 'tidal_access_token');
    await queryInterface.removeColumn('Users', 'tidal_refresh_token');
  }
};
