'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkUpdate(
      'RoleGrants',
      {
        grant_action: JSON.stringify([
          'create:own', // Thay đổi từ 'create:any' -> 'create:own'
          'read:any',
          'update:own',
          'delete:own',
        ]),
      },
      {
        grant_role: 1, // Chỉ cập nhật các quyền của role User
        grant_resource: 4, // Chỉ cập nhật quyền trên Comments resource
      },
    );

    await queryInterface.bulkUpdate(
      'RoleGrants',
      {
        grant_action: JSON.stringify([
          'create:own',
          'read:any',
          'update:own',
          'delete:any',
        ]),
      },
      {
        grant_role: 2,
        grant_resource: 4,
      },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkUpdate(
      'RoleGrants',
      {
        grant_action: JSON.stringify([
          'create:any', // Quay lại giá trị ban đầu
          'read:any',
          'update:own',
          'delete:own',
        ]),
      },
      {
        grant_role: 1,
        grant_resource: 4,
      },
    );

    await queryInterface.bulkUpdate(
      'RoleGrants',
      {
        grant_action: JSON.stringify([
          'create:any', // Quay lại giá trị ban đầu
          'read:any',
          'update:own',
          'delete:own', // khác với giá trị update
        ]),
      },
      {
        grant_role: 2,
        grant_resource: 4,
      },
    );
  },
};
