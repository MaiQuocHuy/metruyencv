import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  Default,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from '@modules/user/models/user.model';
import { Manga } from './manga.model';

@Table({ tableName: 'UserMangaChapters', timestamps: true })
export class UserMangaChapter extends Model {
  @PrimaryKey
  @ForeignKey(() => Manga)
  @Column({ type: DataType.BIGINT, allowNull: false })
  manga_id: number;

  @PrimaryKey
  @ForeignKey(() => User)
  @Column({ type: DataType.BIGINT, allowNull: false })
  user_id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  chapter_being_read: number;

  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  is_deleted: boolean;

  @CreatedAt
  @Column({ type: DataType.DATE })
  createdAt: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE })
  updatedAt: Date;

  // Relationships
  @BelongsTo(() => Manga)
  manga: Manga;

  @BelongsTo(() => User)
  user: User;
}
