import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Manga } from '@modules/manga/models/manga.model';

@Table({ tableName: 'chapters', timestamps: true })
export class Chapter extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  })
  chap_id: number;

  @ForeignKey(() => Manga)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  chap_manga_id: number;

  @BelongsTo(() => Manga)
  manga: Manga;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  chap_number: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  chap_title: string;

  @Column({
    type: DataType.STRING, // * content is a CID of ipfs file
    allowNull: true,
  })
  chap_content: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  chap_views: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_deleted: boolean;
}
