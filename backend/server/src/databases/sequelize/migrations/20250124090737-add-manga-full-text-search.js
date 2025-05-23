'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex(
      'manga',
      ['manga_title', 'manga_description'],
      {
        type: 'FULLTEXT',
        name: 'manga_fulltext_index', // optional name for the index
      },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('manga', 'manga_fulltext_index');
  },
};
