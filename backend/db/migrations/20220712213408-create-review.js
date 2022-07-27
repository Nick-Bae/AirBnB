'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      }, 
      userId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        allowNull:false,
        references: {model: 'Users'},
      },
      spotId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        allowNull:false,
        references: {model: 'Spots'},
      },
      comment: {
        type: Sequelize.STRING
      },
      rating: {
        type: Sequelize.DECIMAL,
        // defaultValue:0
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
    await queryInterface.dropTable('Reviews');
  }
};