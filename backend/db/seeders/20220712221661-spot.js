'use strict';

module.exports = {
  // async up (queryInterface, Sequelize) {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     */
    await queryInterface.bulkInsert('Spots', [
      {
        ownerId: 1,
        address: "123 Disney Lane",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "App Academy",
        description: "Place where web developers are created",
        price: 123,
        createdAt:"2021-11-19 20:39:36",
        updatedAt: "2021-11-19 20:39:36"
      },
      {ownerId: 1,
        address: "123-1 Disney Lane",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "App Academy1",
        description: "Place where web developers are created",
        price: 123,
        createdAt:"2021-11-19 20:39:36",
        updatedAt: "2021-11-19 20:39:36"
      },
      {
        ownerId: 2,
        address: "123-2 Disney Lane",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "App Academy2",
        description: "Place where web developers are created",
        price: 123,
        createdAt:"2021-11-19 20:39:36",
        updatedAt: "2021-11-19 20:39:36"
      },
      // {
      //   ownerId: 3,
      //   name: 'Windy City',
      //   address: '123 Cambel ave Chicago IL 60067',
      //   totalOccupancy: 5,
      //   totalRooms: 3,
      //   totalBathrooms: 2,
      //   hasKitchen: true,
      //   hasAC: true,
      //   hasHeating: true,
      //   hasWifi: true,
      //   isPetAllowed: false,
      //   price: 300,
      //   // image: 'https://images.app.goo.gl/iJnnVeTXiTXu9FGb6',
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
      // {
      //   ownerId: 1,
      //   name: 'Hollywood',
      //   address: '5263 Victory ave Los Angeles CA 90202',
      //   totalOccupancy: 3,
      //   totalRooms: 2,
      //   totalBathrooms: 2,
      //   hasKitchen: true,
      //   hasAC: true,
      //   hasHeating: false,
      //   hasWifi: true,
      //   isPetAllowed: true,
      //   price: 600,
      //   // image: 'https://images.app.goo.gl/LTFk2JmJ1LHuGvgo9',
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
      // {
      //   ownerId: 2,
      //   name: 'Disney World',
      //   address: '100 Disney Rd Orlando FL 32789',
      //   totalOccupancy: 8,
      //   totalRooms: 4,
      //   totalBathrooms: 4,
      //   hasKitchen: true,
      //   hasAC: true,
      //   hasHeating: true,
      //   hasWifi: true,
      //   isPetAllowed: false,
      //   price: 500,
      //   // image:'https://images.app.goo.gl/6UvjgwTV2cySoer88',
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
      // {
      //   ownerId: 3,
      //   name: 'New York City',
      //   address: '20 W 34th St. New York NY 10001',
      //   totalOccupancy: 2,
      //   totalRooms: 1,
      //   totalBathrooms: 1,
      //   hasKitchen: true,
      //   hasAC: true,
      //   hasHeating: true,
      //   hasWifi: true,
      //   isPetAllowed: false,
      //   price: 900,
      //   // image: 'https://images.app.goo.gl/LgkqSUhfahfi3sB29',
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
      // {
      //   ownerId: 2,
      //   name: 'Alaska',
      //   address: '4731 Malley Rd Anchorage AK 99507',
      //   totalOccupancy: 4,
      //   totalRooms: 2,
      //   totalBathrooms: 2,
      //   hasKitchen: true,
      //   hasAC: false,
      //   hasHeating: true,
      //   hasWifi: false,
      //   isPetAllowed: false,
      //   price: 800,
      //   // image:'https://images.app.goo.gl/JaumvRr9qfhpo8v97',
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // }
    ], { validate: true });
  },

  // async down (queryInterface, Sequelize) {
  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     */
    await queryInterface.bulkDelete('Spots', null, {});
  }
};
