'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Spots', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ownerId: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references: {model: 'Owners'}
      },
      name: {
        type: Sequelize.STRING,
        allowNull:false,
        unique: true
      },
      address: {
        type: Sequelize.STRING,
        allowNull:false
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {model:'Users'},
        // allowNull:false
      },
      totalOccupancy: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      totalRooms: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      totalBathrooms: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      hasKitchen: {
        type: Sequelize.BOOLEAN
      },
      hasAC: {
        type: Sequelize.BOOLEAN,
        allowNull:false
      },
      hasHeating: {
        type: Sequelize.BOOLEAN,
        allowNull:false
      },
      hasWifi: {
        type: Sequelize.BOOLEAN,
        allowNull:false
      },
      isPetAllowed: {
        type: Sequelize.BOOLEAN,
        allowNull:false
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      image: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Spots');
  }
};