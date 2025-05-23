/* eslint-disable @typescript-eslint/no-require-imports */
'use strict';
const { hash } = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Hash passwords with salt

    const adminPassword = await hash('admin123', 10);
    const userPassword = await hash('user123', 10);

    await queryInterface.bulkInsert('users', [
      {
        usr_id: 1,
        usr_email: 'admin123@gmail.com',
        usr_password: adminPassword,
        usr_name: 'Admin User',
        usr_avatar: null,
        usr_status: 'active',
        usr_sex: 'male',
        usr_slug: 'admin-user-1',
        usr_role: 2, // Assuming role_id 2 is for admin
        is_deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        usr_id: 2,
        usr_email: 'user123@example.com',
        usr_password: userPassword,
        usr_name: 'Normal User',
        usr_avatar: null,
        usr_status: 'active',
        usr_sex: 'female',
        usr_slug: 'normal-user-2',
        usr_role: 1, // Assuming role_id 1 is for a normal user
        is_deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
