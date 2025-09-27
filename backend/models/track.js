'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Track = sequelize.define('Track', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title_short: {
      type: DataTypes.STRING
    },
    isrc: {
      type: DataTypes.STRING
    },
    duration: {
      type: DataTypes.INTEGER
    },
    rank: {
      type: DataTypes.INTEGER
    },
    release_date: {
      type: DataTypes.DATE
    },
    bpm: {
      type: DataTypes.FLOAT
    },
    gain: {
      type: DataTypes.FLOAT
    },
    album_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Albums',
        key: 'id'
      }
    },
    deezer_id: {
      type: DataTypes.INTEGER
    }
  }, {
    timestamps: true,
    tableName: 'Tracks'
  });

  Track.associate = (models) => {
    Track.belongsTo(models.Album, {
      foreignKey: 'album_id'
    });
    Track.belongsToMany(models.Artist, {
      through: models.TrackArtists,
      foreignKey: 'track_id',
      otherKey: 'artist_id'
    });
  };

  return Track;
};
