import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { User } from '@modules/user/models/user.model';
import { Resource } from './resource.model';
import { RoleGrants } from './rolegrants.model';
@Table({
  tableName: 'roles',
  timestamps: true,
})
export class Role extends Model {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
  role_id: number;

  @Column({
    type: DataType.ENUM('user', 'admin'),
    allowNull: false,
    defaultValue: 'user',
    unique: true,
  })
  role_name: 'user' | 'admin';

  @Column({
    type: DataType.ENUM('active', 'inactive'),
    allowNull: false,
    defaultValue: 'active',
  })
  role_status: 'active' | 'inactive';

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  role_description: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  role_slug: string;

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

  @HasMany(() => User)
  users: User[];

  @BelongsToMany(() => Resource, () => RoleGrants)
  resources: Resource[];
}
