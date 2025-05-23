// filepath: /e:/Work code/web project/Manga/server/src/models/key_token.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '@modules/user/models/user.model';

@Table({
  tableName: 'KeyTokens',
  timestamps: true,
})
export class KeyToken extends Model {
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    unique: true,
  })
  user_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  refresh_key: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  public_key: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  refresh_tokens_used: object;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  refresh_token: string;

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

  @BelongsTo(() => User)
  user: User;
}
