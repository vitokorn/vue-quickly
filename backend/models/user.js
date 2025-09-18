'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    spotyid: DataTypes.STRING,
    country: DataTypes.STRING,
    display_name: DataTypes.STRING,
    access_token: DataTypes.STRING,
    refresh_token: DataTypes.STRING,
    lang: DataTypes.STRING,
    tidal_id: DataTypes.STRING,
    tidal_access_token: DataTypes.TEXT,
    tidal_refresh_token: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
