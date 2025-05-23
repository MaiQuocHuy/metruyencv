'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('RoleGrants', [
      {
        grant_role: 1, // Assuming 'user' role has ID 1
        grant_resource: 1, // Assuming 'Categories' resource has ID 1
        grant_action: JSON.stringify(['read:any']),
        grant_attributes: '*, !is_deleted',
        is_deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        grant_role: 2, // Assuming 'admin' role has ID 2
        grant_resource: 1, // Assuming 'Categories' resource has ID 1
        grant_action: JSON.stringify([
          'read:any',
          'update:any',
          'delete:any',
          'create:any',
        ]),
        grant_attributes: '*',
        is_deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        grant_role: 2, // Admin role for managing users
        grant_resource: 2, // Assuming 'Users' resource has ID 2
        grant_action: JSON.stringify([
          'read:any',
          'update:any',
          'delete:any',
          'create:any',
        ]),
        grant_attributes: '*, !usr_salt',
        is_deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('RoleGrants', null, {});
  },
};
