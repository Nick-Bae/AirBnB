'use strict';
module.exports = {
  up: async (queryInterface, Sequelize)=> {
    await queryInterface.createTable('Reservations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull:false,
        // references: {model: 'Users'}
      },
      spotId: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references: {model: 'Spots'},
        onDelete: 'CASCADE'
      },
      checkIn: {
        type: Sequelize.DATEONLY,
        // allowNull:false
      },
      checkOut: {
        type: Sequelize.DATEONLY,
        // allowNull:false
      },
      totalPrice: {
        type: Sequelize.INTEGER,
        // allowNull:false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Reservations');
  }
};