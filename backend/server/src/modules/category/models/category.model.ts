import { MangaCategory } from '@modules/manga/models/manga-category.model';
import { Manga } from '@modules/manga/models/manga.model';
import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  BelongsToMany,
} from 'sequelize-typescript';

@Table({
  tableName: 'categories',
  timestamps: true, // Automatically handles createdAt and updatedAt
})
export class Category extends Model<Category> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  })
  category_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  category_name: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_deleted: boolean;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  updatedAt: Date;

  @BelongsToMany(() => Manga, () => MangaCategory)
  manga: Manga[];
}
