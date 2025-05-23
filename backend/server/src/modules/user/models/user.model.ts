import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Role } from '@modules/auth/models/role.model'; // Adjust the import path as needed
@Table({
  tableName: 'users',
})
export class User extends Model {
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
  usr_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  usr_email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  usr_password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  usr_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  usr_avatar: string;

  @Column({
    type: DataType.ENUM('pending', 'active', 'block'),
    allowNull: false,
    defaultValue: 'active',
  })
  usr_status: 'pending' | 'active' | 'block';

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  usr_sex: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  usr_slug: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  usr_number_tokens_received_today: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  usr_total_token: number;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  usr_role: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_deleted: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  updatedAt: Date;

  @BelongsTo(() => Role)
  role: Role;
}
