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
      // Spot.hasMany(models.Reservation, {foreignKey: 'spotId',onDelete: 'CASCADE', hooks:true}),
      Spot.hasMany(models.Review, {foreignKey:'spotId'})
      Spot.hasMany(models.Image, {as:'previewImage'}, {foreignKey:'imageableId'})
      Spot.belongsTo(models.User, {foreignKey:'userId'} )
      Spot.belongsTo(models.Owner, {foreignKey:'ownerId'})
    }
  }
  Spot.init({
    ownerId:{
      type:DataTypes.INTEGER,
      allowNull:false
    },
    name: {
      type:DataTypes.STRING,
      allowNull:false,
      // unique: true
    },
    address: {
      type:
      DataTypes.STRING,
      allowNull:false
    },
    userId: {
      type:DataTypes.INTEGER,
        // allowNull:false
      },
    totalOccupancy: {
      type:DataTypes.INTEGER,
        allowNull:false
      },
    totalRooms: {
      type:DataTypes.INTEGER,
        allowNull:false
      },
    totalBathrooms: {
      type:DataTypes.INTEGER,
        allowNull:false
      },
    hasKitchen: {
      type:DataTypes.BOOLEAN,
        allowNull:false
      },
    hasAC: {
      type:DataTypes.BOOLEAN,
        allowNull:false
      },
    hasHeating: {
      type:DataTypes.BOOLEAN,
        allowNull:false
      },
    hasWifi: {
      type:DataTypes.BOOLEAN,
        allowNull:false
      },
    isPetAllowed: {
      type:DataTypes.BOOLEAN,
        allowNull:false
      },
    price: {
      type:DataTypes.INTEGER,
        allowNull:false
      },
    // image: {
    //   type:DataTypes.STRING
    // }
  }, {
    sequelize,
    modelName: 'Spot',
    defaultScope: {
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    }
  });
  return Spot;
};