/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
'use strict';
const { DataTypes } = require('sequelize');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      usr_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
      },
      usr_email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      usr_password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      usr_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      usr_avatar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      usr_status: {
        type: DataTypes.ENUM('pending', 'active', 'block'),
        allowNull: false,
        defaultValue: 'active',
      },
      usr_sex: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      usr_slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      usr_total_token: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      usr_number_tokens_received_today: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      usr_role: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'roles', // Name of the target table
          key: 'role_id', // Key in the target table
        },
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
    await queryInterface.dropTable('users');
  },
};
