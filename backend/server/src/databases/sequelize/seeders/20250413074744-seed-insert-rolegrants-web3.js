'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('RoleGrants', [
      {
        grant_role: 2,
        grant_resource: 12,
        grant_action: JSON.stringify(['read:any']),
        grant_attributes: '*',
        is_deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('RoleGrants', null, {});
  }
};
