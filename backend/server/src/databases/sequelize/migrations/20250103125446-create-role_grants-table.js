'use strict';
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;
    await queryInterface.createTable('RoleGrants', {
      grant_role: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'roles', // Name of the target table
          key: 'role_id', // Key in the target table
        },
        onDelete: 'CASCADE', // Action on delete
        onUpdate: 'CASCADE', // Action on update
        primaryKey: true,
      },
      grant_resource: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'resources', // Name of the target table
          key: 'src_id', // Key in the target table
        },
        onDelete: 'CASCADE', // Action on delete
        onUpdate: 'CASCADE', // Action on update
        primaryKey: true,
      },
      grant_action: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      grant_attributes: {
        type: DataTypes.STRING,
        allowNull: false,
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
    await queryInterface.dropTable('RoleGrants');
  }
};
