/* eslint-disable prettier/prettier */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('resources', [
      {
        src_name: 'Web3',
        src_slug: 'web3',
        src_description: 'Manga web3',
        is_deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('resources', null, {});
  }
};
