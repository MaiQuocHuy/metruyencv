'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('RoleGrants', [
      // Admin Role Grants
      {
        grant_role: 2, // 'Admin' role
        grant_resource: 3, // 'Chapters' resource
        grant_action: JSON.stringify([
          'create:any',
          'read:any',
          'update:any',
          'delete:any',
        ]),
        grant_attributes: '*',
        is_deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        grant_role: 2, // 'Admin' role
        grant_resource: 4, // 'Comments' resource
        grant_action: JSON.stringify([
          'create:any',
          'read:any',
          'update:any',
          'delete:any',
        ]),
        grant_attributes: '*',
        is_deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        grant_role: 2, // 'Admin' role
        grant_resource: 5, // 'Error Reports' resource
        grant_action: JSON.stringify(['read:any', 'update:any', 'delete:any']),
        grant_attributes: '*',
        is_deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        grant_role: 2, // 'Admin' role
        grant_resource: 6, // 'Favorites' resource
        grant_action: JSON.stringify(['read:any']),
        grant_attributes: '*',
        is_deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        grant_role: 2, // 'Admin' role
        grant_resource: 7, // 'Manga' resource
        grant_action: JSON.stringify([
          'create:any',
          'read:any',
          'update:any',
          'delete:any',
        ]),
        grant_attributes: '*',
        is_deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        grant_role: 2, // 'Admin' role
        grant_resource: 8, // 'Notifications' resource
        grant_action: JSON.stringify([
          'create:any',
          'read:any',
          'update:any',
          'delete:any',
        ]),
        grant_attributes: '*',
        is_deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        grant_role: 2, // 'Admin' role
        grant_resource: 9, // 'Resources' resource
        grant_action: JSON.stringify([
          'create:any',
          'read:any',
          'update:any',
          'delete:any',
        ]),
        grant_attributes: '*',
        is_deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        grant_role: 2, // 'Admin' role
        grant_resource: 10, // 'Role Grants' resource
        grant_action: JSON.stringify([
          'create:any',
          'read:any',
          'update:any',
          'delete:any',
        ]),
        grant_attributes: '*',
        is_deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        grant_role: 2, // 'Admin' role
        grant_resource: 11, // 'Roles' resource
        grant_action: JSON.stringify([
          'create:any',
          'read:any',
          'update:any',
          'delete:any',
        ]),
        grant_attributes: '*',
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
