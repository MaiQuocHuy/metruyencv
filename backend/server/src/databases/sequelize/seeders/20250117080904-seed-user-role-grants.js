'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('RoleGrants', [
      // User Role Grants
      {
        grant_role: 1, // 'User' role
        grant_resource: 2, // 'User' resource
        grant_action: JSON.stringify(['read:own', 'update:own']),
        grant_attributes: '*,!usr_salt',
        is_deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        grant_role: 1, // 'User' role
        grant_resource: 3, // 'Chapters' resource
        grant_action: JSON.stringify(['read:any']),
        grant_attributes: '*, !is_deleted',
        is_deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        grant_role: 1, // 'User' role
        grant_resource: 4, // 'Comments' resource
        grant_action: JSON.stringify([
          'create:any',
          'read:any',
          'update:own',
          'delete:own',
        ]),
        grant_attributes: '*, !is_deleted',
        is_deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        grant_role: 1, // 'User' role
        grant_resource: 5,
        grant_action: JSON.stringify(['create:any']),
        grant_attributes: '*, !is_deleted',
        is_deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        grant_role: 1, // 'User' role
        grant_resource: 6, // 'Favorites' resource
        grant_action: JSON.stringify(['create:own', 'read:own', 'update:own']),
        grant_attributes: '*, !is_deleted',
        is_deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        grant_role: 1, // 'User' role
        grant_resource: 7, // 'Favorites' resource
        grant_action: JSON.stringify(['read:any']),
        grant_attributes: '*, !is_deleted, !is_draft, !is_published',
        is_deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        grant_role: 1, // 'User' role
        grant_resource: 8, // 'Favorites' resource
        grant_action: JSON.stringify(['read:any']),
        grant_attributes: '*, !is_deleted, !noti_admin_id',
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
