'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     */
   await queryInterface.bulkInsert('Reviews', [
    {
      userId: 1,
      spotId: 1,
      review: "This was an awesome spot!",
      stars: 5
    }
  //   {
  //    userId: 1,
  //    spotId: 1,
  //    comment: "This place is nice and clean",
  //    rating: 4,
  //    createdAt: new Date(),
  //    updatedAt: new Date()
  //  },
  //   {
  //    userId: 2 ,
  //    spotId: 2,
  //    comment:"The host is very kind" ,
  //    rating: 5,
  //    createdAt: new Date(),
  //    updatedAt: new Date()
  //  },
  //   {
  //    userId: 3,
  //    spotId: 1,
  //    comment: "Bedrooms are very tiny" ,
  //    rating: 3,
  //    createdAt: new Date(),
  //    updatedAt: new Date()
  //  },
  //   {
  //    userId: 4 ,
  //    spotId: 5,
  //    comment: "Everything is in walking distance",
  //    rating: 4.5,
  //    createdAt: new Date(),
  //    updatedAt: new Date()
  //  },
  //   {
  //    userId: 1,
  //    spotId: 2,
  //    comment: "My family had a great time",
  //    rating: 4.9,
  //    createdAt: new Date(),
  //    updatedAt: new Date()
  //  },
  //   {
  //    userId: 2,
  //    spotId: 3,
  //    comment: "Everything is good except bathrooms",
  //    rating: 3.8,
  //    createdAt: new Date(),
  //    updatedAt: new Date()
  //  },
  ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     */
     await queryInterface.bulkDelete('Reviews', null, {});
  }
};
