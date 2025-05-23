import { Category } from '@modules/category/models/category.model';
import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  PrimaryKey,
  AutoIncrement,
  BelongsToMany,
} from 'sequelize-typescript';
import { MangaCategory } from './manga-category.model';

@Table({
  tableName: 'manga',
  timestamps: true,
})
export class Manga extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  manga_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  manga_title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  manga_thumb: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  manga_slug: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  manga_description: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  manga_author: string;

  @Default('ongoing')
  @Column({
    type: DataType.ENUM('ongoing', 'completed', 'hiatus'),
    allowNull: false,
  })
  manga_status: string;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  manga_views: number;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  manga_ratings_count: number;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  manga_total_star_rating: number;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  manga_number_of_followers: number;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  is_deleted: boolean;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
  })
  is_draft: boolean;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  is_published: boolean;

  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  createdAt: Date;

  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  updatedAt: Date;

  @BelongsToMany(() => Category, () => MangaCategory)
  categories: Category[];
}
