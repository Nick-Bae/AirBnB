'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Review.belongsTo(models.Spot, {foreignKey: 'spotId'}),
      Review.belongsTo(models.User, {foreignKey: 'userId'})
      Review.hasMany(models.Image, {foreignKey: 'reviewId'})
    }
  }
  Review.init({
    userId: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    spotId: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    review: DataTypes.STRING,
    stars: DataTypes.DECIMAL(1,1),
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};