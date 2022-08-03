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
    spotId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
      // allowNull:false
    
      // allowNull:false
    startDate: DataTypes.DATEONLY,
      // allowNull:false
    endDate: {
      type:DataTypes.DATEONLY,
      // validate:{
      //   isAfter: "startDate"
      // }
    },
      // allowNull:false
   }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};