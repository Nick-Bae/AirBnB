'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class Owner extends Model {
    toSafeObject() {
      const { id, username, email } = this; 
      return { id, username, email };
    }

    validatePassword(password) {
      return bcrypt.compareSync(password, this.hashedPassword.toString());
    }

    static getCurrentUserById(id) {
      return Owner.scope("currentUser").findByPk(id);
    }

    static async login({ credential, password }) {
      // const { Op } = require('sequelize');
      const owner = await Owner.scope('loginOwner').findOne({
        where: {
          // [Op.or]: {
          name: credential,
          // email: credential
          // }
        }
      });
      if (owner && owner.validatePassword(password)) {
        return await Owner.scope('currentOwner').findByPk(owner.id);
      }
    }

    static associate(models) {
      // define association here
      Owner.hasMany(models.Spot, { foreignKey: 'ownerId' })
    }
  }
  Owner.init({
    name: DataTypes.STRING,
    // spotId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: "Owner",
    defaultScope: {
      attributes: {
        exclude: ["hashedPassword", "createdAt", "updatedAt"]
      }
    },
    scopes: {
      currentOwner: {
        attributes: { exclude: ["hashedPassword"] }
      },
      loginOwner: {
        attributes: {}
      }
    }
  });
  return Owner;
};