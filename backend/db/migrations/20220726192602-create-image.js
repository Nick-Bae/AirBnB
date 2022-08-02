'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Images', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      url: {
        type: Sequelize.STRING,
        allowNull:true
      },
      previewImage: {
        type: Sequelize.BOOLEAN
      },
      spotId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {model:'Spots'}
      },
      reviewId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {model:'Reviews'}
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {model: 'Users'},
        onDelete: 'CASCADE'
      },
      // imageableId: {
      //   type: Sequelize.INTEGER,
      //   references: {model:'Spots'},
      //   references: {model:'Reviews'}
      // },
      // imageableType:{
      //   type: Sequelize.ENUM('spot','review','none')
      // },
      
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Images');
  }
};