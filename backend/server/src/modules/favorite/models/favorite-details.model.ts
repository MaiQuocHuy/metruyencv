import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
  Default,
  PrimaryKey,
} from 'sequelize-typescript';
import { Favorite } from './favorite.model';
import { Manga } from '@modules/manga/models/manga.model';

@Table({
  tableName: 'FavoriteDetails',
  timestamps: true,
})
export class FavoriteDetail extends Model {
  @PrimaryKey
  @ForeignKey(() => Manga)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  manga_id: number;

  @BelongsTo(() => Manga)
  manga: Manga;

  @PrimaryKey
  @ForeignKey(() => Favorite)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  fav_id: number;

  @BelongsTo(() => Favorite)
  favorite: Favorite;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
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
}
