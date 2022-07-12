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
      name: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      host_id: {
        type: Sequelize.INTEGER
      },
      total_occupancy: {
        type: Sequelize.INTEGER
      },
      total_rooms: {
        type: Sequelize.INTEGER
      },
      total_bathrooms: {
        type: Sequelize.INTEGER
      },
      has_kitchen: {
        type: Sequelize.BOOLEAN
      },
      has_AC: {
        type: Sequelize.BOOLEAN
      },
      has_heating: {
        type: Sequelize.BOOLEAN
      },
      has_wifi: {
        type: Sequelize.BOOLEAN
      },
      isPetAllowed: {
        type: Sequelize.BOOLEAN
      },
      price: {
        type: Sequelize.INTEGER
      },
      review_id: {
        type: Sequelize.INTEGER
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