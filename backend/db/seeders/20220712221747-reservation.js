'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     */
    await queryInterface.bulkInsert('Reservations', [
      {
      userId: 1,
      spotId: 1,
      checkIn: '2022-07-24',
      checkOut: '2022-07-28',
      totalPrice: 1500,
      createdAt: new Date(),
      updatedAt: new Date()
      },
      {
      userId: 2,
      spotId: 2,
      checkIn: '2022-08-24',
      checkOut: '2022-08-28',
      totalPrice: 900,
      createdAt: new Date(),
      updatedAt: new Date()
      },
      {
      userId: 3,
      spotId: 1,
      checkIn: '2022-09-24',
      checkOut: '2022-09-28',
      totalPrice: 1200,
      createdAt: new Date(),
      updatedAt: new Date()
      },
      {
      userId: 4,
      spotId: 3,
      checkIn: '2022-10-24',
      checkOut: '2022-10-28',
      totalPrice: 1100,
      createdAt: new Date(),
      updatedAt: new Date()
      },
      {
      userId: 1,
      spotId: 2,
      checkIn: '2022-11-24',
      checkOut: '2022-11-28',
      totalPrice: 1800,
      createdAt: new Date(),
      updatedAt: new Date()
      },
      {
      userId: 2,
      spotId: 3,
      checkIn: '2022-12-24',
      checkOut: '2022-12-28',
      totalPrice: 2500,
      createdAt: new Date(),
      updatedAt: new Date()
      },
  ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     */
    await queryInterface.bulkDelete('Reservations', null, {});
  }
};
