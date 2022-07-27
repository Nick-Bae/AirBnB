'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     */
    await queryInterface.bulkInsert('Owners', [
      {
        name: 'Wade Harris',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Dan Lewis',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Ethan Walker',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     */
    await queryInterface.bulkDelete('Owners', null, {});
  }
};
