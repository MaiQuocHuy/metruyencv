'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('resources', [
      {
        src_name: 'Chapters',
        src_slug: 'chapters',
        src_description: 'Manage chapters',
        is_deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        src_name: 'Comments',
        src_slug: 'comments',
        src_description: 'Manage comments',
        is_deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        src_name: 'Error Reports',
        src_slug: 'errorreports',
        src_description: 'Manage error reports',
        is_deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        src_name: 'Favorites',
        src_slug: 'favorites',
        src_description: 'Manage favorites',
        is_deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        src_name: 'Manga',
        src_slug: 'manga',
        src_description: 'Manage manga',
        is_deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        src_name: 'Notifications',
        src_slug: 'notifications',
        src_description: 'Manage notifications',
        is_deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        src_name: 'Resources',
        src_slug: 'resources',
        src_description: 'Manage resources',
        is_deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        src_name: 'Role Grants',
        src_slug: 'rolegrants',
        src_description: 'Manage role grants',
        is_deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        src_name: 'Roles',
        src_slug: 'roles',
        src_description: 'Manage roles',
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
