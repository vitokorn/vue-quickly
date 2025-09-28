'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add label_id column to Tracks table
    await queryInterface.addColumn('Tracks', 'label_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Labels',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down (queryInterface, Sequelize) {
    // Remove label_id column from Tracks table
    await queryInterface.removeColumn('Tracks', 'label_id');
  }
};
