'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkUpdate(
      'RoleGrants',
      {
        grant_attributes: '*',
      },
      {
        grant_role: 1, // Chỉ cập nhật các quyền của role User
        grant_resource: 2, // Chỉ cập nhật quyền trên Users resource
      },
    );

    await queryInterface.bulkUpdate(
      'RoleGrants',
      {
        grant_attributes: '*, !usr_password',
      },
      {
        grant_role: 2, // Chỉ cập nhật các quyền của role Admin
        grant_resource: 2, // Chỉ cập nhật quyền trên Users resource
      },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkUpdate(
      'RoleGrants',
      {
        grant_attributes: '*, !usr_salt',
      },
      {
        grant_role: 1, // Chỉ cập nhật các quyền của role User
        grant_resource: 2, // Chỉ cập nhật quyền trên Users resource
      },
    );

    await queryInterface.bulkUpdate(
      'RoleGrants',
      {
        grant_attributes: '*, !usr_salt',
      },
      {
        grant_role: 2, // Chỉ cập nhật các quyền của role Admin
        grant_resource: 2, // Chỉ cập nhật quyền trên Users resource
      },
    );
  }
};
