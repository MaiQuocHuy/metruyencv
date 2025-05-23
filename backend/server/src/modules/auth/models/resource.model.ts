// filepath: /e:/Work code/web project/Manga/server/src/models/resource.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
  HasMany,
} from 'sequelize-typescript';
import { RoleGrants } from './rolegrants.model';
import { Role } from './role.model';

@Table({
  tableName: 'resources',
  timestamps: true,
})
export class Resource extends Model {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
  src_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  src_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  src_slug: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  src_description: string;

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

  @BelongsToMany(() => Role, () => RoleGrants)
  roles: Role[];
}
