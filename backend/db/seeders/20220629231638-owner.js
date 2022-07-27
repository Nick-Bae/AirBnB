'use strict';
const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    
    await queryInterface.bulkInsert('Owners', [
      {
        name: 'Wade Harris',
        hashedPassword: bcrypt.hashSync('password'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Dan Lewis',
        hashedPassword: bcrypt.hashSync('password'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Ethan Walker',
        hashedPassword: bcrypt.hashSync('password'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
  
    await queryInterface.bulkDelete('Owners', null, {});
  }
};
