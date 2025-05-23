'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('favorites', [
      {
        fav_id: 1,
        fav_user_id: 2, // Assuming this user with usr_id 2 exists in the users table
        is_deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('favorites', null, {});
  },
};
