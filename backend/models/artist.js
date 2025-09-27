'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Artist = sequelize.define('Artist', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    deezer_id: {
      type: DataTypes.INTEGER
    }
  }, {
    timestamps: true,
    tableName: 'Artists'
  });

  Artist.associate = (models) => {
    Artist.belongsToMany(models.Label, {
      through: models.ArtistsLabels,
      foreignKey: 'artist_id',
      otherKey: 'label_id'
    });
    Artist.belongsToMany(models.Track, {
      through: models.TrackArtists,
      foreignKey: 'artist_id',
      otherKey: 'track_id'
    });
  };

  return Artist;
};
