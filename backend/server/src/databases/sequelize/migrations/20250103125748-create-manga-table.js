'use strict';
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;
    await queryInterface.createTable('manga', {
      manga_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
      },
      manga_title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      manga_thumb: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      manga_slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      manga_description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      manga_author: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      manga_status: {
        allowNull: false,
        defaultValue: 'ongoing',
        type: DataTypes.ENUM('ongoing', 'completed', 'hiatus'),
      },
      manga_views: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      manga_ratings_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      manga_total_star_rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      manga_number_of_followers: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_draft: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      is_published: {
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
    await queryInterface.dropTable('manga');
  }
};
