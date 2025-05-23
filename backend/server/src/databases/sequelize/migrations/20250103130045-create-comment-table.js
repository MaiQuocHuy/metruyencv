'use strict';
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;
    await queryInterface.createTable('comments', {
      comment_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
      },
      comment_user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'users', // Name of the target table
          key: 'usr_id', // Key in the target table
        },
        onDelete: 'CASCADE', // Action on delete
        onUpdate: 'CASCADE', // Action on update
      },
      comment_manga_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'manga', // Name of the target table
          key: 'manga_id', // Key in the target table
        },
        onDelete: 'CASCADE', // Action on delete
        onUpdate: 'CASCADE', // Action on update
      },
      comment_chapter_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'chapters', // Name of the target table
          key: 'chap_id', // Key in the target table
        },
        onDelete: 'CASCADE', // Action on delete
        onUpdate: 'CASCADE', // Action on update
      },
      comment_content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      comment_left: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      comment_right: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      comment_parent_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: 'comments', // Name of the target table
          key: 'comment_id', // Key in the target table
        },
        onDelete: 'CASCADE', // Action on delete
        onUpdate: 'CASCADE', // Action on update
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
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
    await queryInterface.dropTable('comments');
  }
};
