import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  AutoIncrement,
  Default,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from '@modules/user/models/user.model';
import { Manga } from '@modules/manga/models/manga.model';
import { Chapter } from '@modules/chapter/models/chapter.model';

@Table({ tableName: 'comments', timestamps: true })
export class Comment extends Model<Comment> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.BIGINT })
  comment_id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.BIGINT, allowNull: false })
  comment_user_id: number;

  @ForeignKey(() => Manga)
  @Column({ type: DataType.BIGINT, allowNull: false })
  comment_manga_id: number;

  @ForeignKey(() => Chapter)
  @Column({ type: DataType.BIGINT, allowNull: false })
  comment_chapter_id: number;

  @ForeignKey(() => Comment)
  @Column({ type: DataType.BIGINT, allowNull: true, defaultValue: null })
  comment_parent_id: number | null;

  @Column({ type: DataType.TEXT, allowNull: false })
  comment_content: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  comment_left: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  comment_right: number;

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
  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Manga)
  manga: Manga;

  @BelongsTo(() => Chapter)
  chapter: Chapter;

  @BelongsTo(() => Comment, { foreignKey: 'comment_parent_id' })
  parentComment: Comment;
}
