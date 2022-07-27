'use strict';
const { Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Reservation.belongsTo(models.User, {foreignKey:'userId'}),
      Reservation.belongsTo(models.Spot, {foreignKey:'spotId'})
    }
  };
  Reservation.init({
    userId: DataTypes.INTEGER,
      // allowNull:false
    
    spotId: DataTypes.INTEGER,
      // allowNull:false
    checkIn: DataTypes.DATEONLY,
      // allowNull:false
    checkOut: DataTypes.DATEONLY,
      // allowNull:false
   totalPrice: DataTypes.INTEGER,
      // allowNull:false
   }, {
    sequelize,
    modelName: 'Reservation',
  });
  return Reservation;
};