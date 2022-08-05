'use strict';
// const moment = require('moment')

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
    stars: {
      type:DataTypes.DECIMAL(1,1),
      defaultValue: 0,
    },
  //   createdAt: {
  //     type: DataTypes.DATE,                  
  //   get() {
  //         return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD hh:mm:ss');
  //     }
  // },
  // updatedAt: {
  //     type: DataTypes.DATE,
  //     get() {
  //         return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD hh:mm:ss');
  //     }
  // }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};