'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const LabelGenres = sequelize.define('LabelGenres', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    label_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Labels',
        key: 'id'
      }
    },
    genre_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Genres',
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    tableName: 'LabelGenres'
  });

  return LabelGenres;
};
