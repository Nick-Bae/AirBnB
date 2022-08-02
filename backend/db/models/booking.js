'use strict';
const { Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsTo(models.User, {foreignKey:'userId'})
      Booking.belongsTo(models.Spot, {foreignKey:'spotId'})
    }
  };
  Booking.init({
    userId: DataTypes.INTEGER,
      // allowNull:false
    
    spotId: DataTypes.INTEGER,
      // allowNull:false
    startDate: DataTypes.DATEONLY,
      // allowNull:false
    endDate: DataTypes.DATEONLY,
      // allowNull:false
   }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};