// filepath: /e:/Work code/web project/Manga/server/src/models/role_grants.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Role } from './role.model';
import { Resource } from './resource.model';

@Table({
  tableName: 'rolegrants',
  timestamps: true,
})
export class RoleGrants extends Model {
  @ForeignKey(() => Role)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
  })
  grant_role: number;

  @ForeignKey(() => Resource)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
  })
  grant_resource: number;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  grant_action: object;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  grant_attributes: string;

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
  @BelongsTo(() => Resource)
  resource: Resource;
}
