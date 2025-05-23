import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  ForeignKey,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
} from 'sequelize-typescript';
import { Manga } from './manga.model';
import { Category } from '@modules/category/models/category.model';

@Table({ tableName: 'MangaCategory', timestamps: true })
export class MangaCategory extends Model {
  @PrimaryKey
  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  category_id: number;

  @PrimaryKey
  @ForeignKey(() => Manga)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  manga_id: number;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  is_deleted: boolean;

  @CreatedAt
  @Column({
    type: DataType.DATE,
  })
  createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
  })
  updatedAt: Date;

  @BelongsTo(() => Manga)
  manga: Manga;
  @BelongsTo(() => Category)
  category: Category;
}
