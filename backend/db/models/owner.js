'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Owner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Owner.hasMany(models.Spot, {foreignKey: 'ownerId'})
    }
  }
  Owner.init({
    name: DataTypes.STRING,
    // spotId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Owner',
    defaultScope: {
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    }
  });
  return Owner;
};