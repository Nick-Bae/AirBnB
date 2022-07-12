'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Spot.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    host_id: DataTypes.INTEGER,
    total_occupancy: DataTypes.INTEGER,
    total_rooms: DataTypes.INTEGER,
    total_bathrooms: DataTypes.INTEGER,
    has_kitchen: DataTypes.BOOLEAN,
    has_AC: DataTypes.BOOLEAN,
    has_heating: DataTypes.BOOLEAN,
    has_wifi: DataTypes.BOOLEAN,
    isPetAllowed: DataTypes.BOOLEAN,
    price: DataTypes.INTEGER,
    review_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};