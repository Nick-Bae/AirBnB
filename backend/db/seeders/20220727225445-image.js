'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     */
    await queryInterface.bulkInsert('Images', [
      {
      spotId: 1,
      reviewId: 1,
      url: "https://images.app.goo.gl/9jozT6bUwgupPMkT8"
    },
      {
      spotId: 2,
      reviewId: 2,
      url: "https://images.app.goo.gl/eiR4ZwXGKZ21DfkS9"
    },
      {
      spotId: 1,
      reviewId: 3,
      url: "https://images.app.goo.gl/Nhr9meLfC2BwPYVX8"
    },
      {
      spotId: 5,
      reviewId: 4,
      url: "https://images.app.goo.gl/K3YrBdzFCkN3vTkBA"
    },
      {
      spotId: 2,
      reviewId:5 ,
      url: "https://images.app.goo.gl/9HAjMpf5FBEozvwy5"
    },
      {
      spotId: 3,
      reviewId:6 ,
      url: "https://images.app.goo.gl/oLmp6E6t722Fb5PUA"
    },
      {
      spotId: 1,
      url: "https://images.app.goo.gl/iJnnVeTXiTXu9FGb6"
    },
      {
      spotId: 2,
      url: "https://images.app.goo.gl/LTFk2JmJ1LHuGvgo9"
    },
      {
      spotId: 3,
      url: 'https://images.app.goo.gl/6UvjgwTV2cySoer88'
    },
      {
      spotId: 4,
      url: "https://images.app.goo.gl/LgkqSUhfahfi3sB29"
    },
      {
      spotId: 5,
      url: "https://images.app.goo.gl/JaumvRr9qfhpo8v97"
    },

  ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     */
     await queryInterface.bulkDelete('Images', null, {});
  }
};
