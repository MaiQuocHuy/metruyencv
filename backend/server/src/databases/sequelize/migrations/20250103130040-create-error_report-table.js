'use strict';
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;
    await queryInterface.createTable('ErrorReports', {
      report_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
      },
      report_user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'users',
          key: 'usr_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      report_chapter_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'chapters',
          key: 'chap_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      report_admin_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: 'users',
          key: 'usr_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      report_kind_of_error: {
        type: DataTypes.ENUM('error-image', 'duplicate-chapter', 'chapter-not-translated-yet'),
        allowNull: false,
        defaultValue: 'error-image',
      },
      report_description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_fixed: {
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
    await queryInterface.dropTable('ErrorReports');
  }
};
