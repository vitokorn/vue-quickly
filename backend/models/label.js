'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Label = sequelize.define('Label', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    label_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    musicbrainz_id: {
      type: DataTypes.STRING
    },
    beatport_id: {
      type: DataTypes.STRING
    }
  }, {
    timestamps: true,
    tableName: 'Labels'
  });

  Label.associate = (models) => {
    Label.belongsToMany(models.Artist, {
      through: models.ArtistsLabels,
      foreignKey: 'label_id',
      otherKey: 'artist_id'
    });
    Label.belongsToMany(models.Genre, {
      through: models.LabelGenres,
      foreignKey: 'label_id',
      otherKey: 'genre_id'
    });
    Label.hasMany(models.Album, {
      foreignKey: 'label_id'
    });
  };

  return Label;
};
