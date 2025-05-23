'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('categories', [
      {
        category_name: 'Action',
        is_deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        category_name: 'Romance',
        is_deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        category_name: 'Fantasy',
        is_deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        category_name: 'Adventure',
        is_deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        category_name: 'Horror',
        is_deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  },
};
