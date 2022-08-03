'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     */
    await queryInterface.bulkInsert('Bookings', [
      {
          spotId: 1,
          userId: 1,
          startDate:'2022-9-01',
          endDate:'2022-9-21'
      },
      {
          spotId: 1,
          userId: 2,
          startDate:'2022-10-01',
          endDate:'2022-10-11'
      },
      {
          spotId: 2,
          userId: 3,
          startDate:'2022-8-14',
          endDate:'2022-8-16'
      },
      {
          spotId: 3,
          userId: 3,
          startDate:'2022-11-01',
          endDate:'2022-11-19'
      },
      {
          spotId: 3,
          userId: 1,
          startDate:'2021-11-01',
          endDate:'2021-11-19'
      },
      // {
      // userId: 1,
      // spotId: 1,
      // checkIn: '2022-07-24',
      // checkOut: '2022-07-28',
      // totalPrice: 1500,
      // createdAt: new Date(),
      // updatedAt: new Date()
      // },
      // {
      // userId: 2,
      // spotId: 2,
      // checkIn: '2022-08-24',
      // checkOut: '2022-08-28',
      // totalPrice: 900,
      // createdAt: new Date(),
      // updatedAt: new Date()
      // },
      // {
      // userId: 3,
      // spotId: 1,
      // checkIn: '2022-09-24',
      // checkOut: '2022-09-28',
      // totalPrice: 1200,
      // createdAt: new Date(),
      // updatedAt: new Date()
      // },
      // {
      // userId: 4,
      // spotId: 3,
      // checkIn: '2022-10-24',
      // checkOut: '2022-10-28',
      // totalPrice: 1100,
      // createdAt: new Date(),
      // updatedAt: new Date()
      // },
      // {
      // userId: 1,
      // spotId: 2,
      // checkIn: '2022-11-24',
      // checkOut: '2022-11-28',
      // totalPrice: 1800,
      // createdAt: new Date(),
      // updatedAt: new Date()
      // },
      // {
      // userId: 2,
      // spotId: 3,
      // checkIn: '2022-12-24',
      // checkOut: '2022-12-28',
      // totalPrice: 2500,
      // createdAt: new Date(),
      // updatedAt: new Date()
      // },
  ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     */
    await queryInterface.bulkDelete('Bookings', null, {});
  }
};
