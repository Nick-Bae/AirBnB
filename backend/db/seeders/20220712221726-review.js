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
    },
    {
     userId: 2,
     spotId: 1,
     review: "This place is nice and clean",
     stars: 4,
   },
    {
     userId: 2 ,
     spotId: 2,
     review:"The host is very kind" ,
     stars: 5,
   },
    {
     userId: 3,
     spotId: 3,
     review: "Bedrooms are very tiny" ,
     stars: 3,
   },
  //   {
  //    userId: 4 ,
  //    spotId: 5,
  //    review: "Everything is in walking distance",
  //    stars: 4.5,
  //    createdAt: new Date(),
  //    updatedAt: new Date()
  //  },
  //   {
  //    userId: 1,
  //    spotId: 2,
  //    comment: "My family had a great time",
  //    stars: 4.9,
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
