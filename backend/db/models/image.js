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
      Image.belongsTo(models.User, { foreignKey: 'userId' })
      Image.belongsTo(models.Spot, {  foreignKey: 'spotId' })
      Image.belongsTo(models.Review, { foreignKey: 'reviewId' })
    }
  }
  Image.init({
    url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    previewImage: DataTypes.BOOLEAN,
    spotId: DataTypes.INTEGER,
    reviewId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    // imageableId: DataTypes.INTEGER,
    // imageableType: DataTypes.ENUM,
  }, {
    sequelize,
    modelName: 'Image',
    // defaultScope: {
    //   attributes: {
    //     exclude: ["createdAt", "updatedAt"]
    //   }
    // }
  });
  return Image;
};