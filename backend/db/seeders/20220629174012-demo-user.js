'use strict';
const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      // {
      //   firstName: "John",
      //   lastName: "Smith",
      //   email: "john.smith@gmail.com",
      //   username: "JohnSmith",
      //   hashedPassword: bcrypt.hashSync('password')
      // },
      {
        firstName: "Namju",
        lastName:"Bae",
        email: 'namjubae@gmail.com',
        username: 'namjubae',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName:"Fake",
        lastName:"Lee",
        username: 'FakeUser1',
        email: 'user1@user.io',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName:"Fake2",
        lastName:"Lim",
        username: 'FakeUser2',
        email: 'user2@user.io',
        hashedPassword: bcrypt.hashSync('password')
      },
      // {
      //   username: 'FakeUser2',
      //   email: 'user2@user.io',
      //   hashedPassword: bcrypt.hashSync('password3')
      // },
      // {
      //   username: 'namju',
      //   email: 'namju@gmail.com',
      //   hashedPassword: bcrypt.hashSync('password')
      // }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Users', {
      username: { [Op.in]: ['JohnSmith'] }
    }, {});
  }
};