'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('resources', [
      {
        src_name: 'Categories',
        src_slug: 'categories',
        src_description: 'Manage categories',
        is_deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        src_name: 'Users',
        src_slug: 'users',
        src_description: 'Manage users',
        is_deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('resources', null, {});
  },
};
