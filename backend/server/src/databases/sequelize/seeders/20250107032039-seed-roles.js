'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      {
        role_name: 'user',
        role_status: 'active',
        role_description: 'Regular user with limited access',
        role_slug: 'user',
        is_deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role_name: 'admin',
        role_status: 'active',
        role_description: 'Administrator with full access',
        role_slug: 'admin',
        is_deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  },
};
