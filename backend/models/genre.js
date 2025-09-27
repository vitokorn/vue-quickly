'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Genre = sequelize.define('Genre', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    musicbrainz_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    beatport_id: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    timestamps: true,
    tableName: 'Genres'
  });

  Genre.associate = (models) => {
    Genre.belongsToMany(models.Label, {
      through: models.LabelGenres,
      foreignKey: 'genre_id',
      otherKey: 'label_id'
    });
  };

  return Genre;
};
