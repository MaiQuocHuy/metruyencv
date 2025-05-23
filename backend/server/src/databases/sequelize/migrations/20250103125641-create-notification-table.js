'use strict';
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;
    await queryInterface.createTable('notifications', {
      noti_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
      },
      noti_admin_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'users', // Name of the target table
          key: 'usr_id', // Key in the target table
        },
        onDelete: 'CASCADE', // Action on delete
        onUpdate: 'CASCADE', // Action on update
      },
      noti_title: {
        type: DataTypes.ENUM('comment_received ', 'system_update', 'feature_update '),
        allowNull: false,
        defaultValue: 'comment_received ',
      },
      noti_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      noti_content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      noti_option: {
        type: DataTypes.JSON,
        allowNull: true,
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
    await queryInterface.dropTable('notifications');
  }
};
