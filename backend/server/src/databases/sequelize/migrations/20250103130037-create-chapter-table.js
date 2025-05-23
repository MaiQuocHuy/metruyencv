'use strict';
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;
    await queryInterface.createTable('chapters', {
      chap_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
      },
      chap_manga_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'manga', // Name of the target table
          key: 'manga_id', // Key in the target table
        },
        onDelete: 'CASCADE', // Action on delete
        onUpdate: 'CASCADE', // Action on update
      },
      chap_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      chap_title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      chap_content: { // content is a CID of ipfs file
        type: DataTypes.STRING,
        allowNull: true,
      },
      chap_views: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('chapters');
  }
};
