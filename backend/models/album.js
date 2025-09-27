'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Album = sequelize.define('Album', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    label_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Labels',
        key: 'id'
      }
    },
    release_date: {
      type: DataTypes.DATE
    },
    type: {
      type: DataTypes.STRING
    },
    duration: {
      type: DataTypes.INTEGER
    },
    cover: {
      type: DataTypes.STRING
    },
    deezer_id: {
      type: DataTypes.INTEGER
    }
  }, {
    timestamps: true,
    tableName: 'Albums'
  });

  Album.associate = (models) => {
    Album.belongsTo(models.Label, {
      foreignKey: 'label_id'
    });
    Album.hasMany(models.Track, {
      foreignKey: 'album_id'
    });
  };

  return Album;
};
