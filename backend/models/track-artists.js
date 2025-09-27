'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TrackArtists = sequelize.define('TrackArtists', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    track_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Tracks',
        key: 'id'
      }
    },
    artist_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Artists',
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    tableName: 'TrackArtists'
  });

  return TrackArtists;
};
