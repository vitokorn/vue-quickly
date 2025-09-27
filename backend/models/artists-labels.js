'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ArtistsLabels = sequelize.define('ArtistsLabels', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    artist_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Artists',
        key: 'id'
      }
    },
    label_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Labels',
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    tableName: 'ArtistsLabels'
  });

  return ArtistsLabels;
};
