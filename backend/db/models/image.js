'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Image.belongsTo(models.Spot, {foreignKey:'spotId'})
      // Image.belongsTo(models.Review, {foreignKey: 'reviewId'})
      Image.belongsTo(models.Spot, {foreignKey:'imageableId'})
      Image.belongsTo(models.Review, {foreignKey:'imageableId'})
    }
  }
  Image.init({
    // spotId: DataTypes.INTEGER,
    // reviewId: DataTypes.INTEGER,
    imageableId: DataTypes.INTEGER,
    imageableType: DataTypes.STRING,
    url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Image',
    defaultScope: {
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    }
  });
  return Image;
};