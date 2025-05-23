import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Unique,
  AllowNull,
  Default,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from '@modules/user/models/user.model';
import { Chapter } from '@modules/chapter/models/chapter.model';
import { ReportKindOfError } from '../enums/report-kind-of-error.enum';

@Table({ tableName: 'ErrorReports', timestamps: true })
export class ErrorReport extends Model {
  @PrimaryKey
  @AutoIncrement
  @Unique
  @Column(DataType.INTEGER)
  report_id: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.BIGINT)
  report_user_id: number;

  @BelongsTo(() => User, {
    as: 'UserReportError',
    foreignKey: 'report_user_id',
  })
  user: User;

  @ForeignKey(() => Chapter)
  @AllowNull(false)
  @Column(DataType.BIGINT)
  report_chapter_id: number;

  @BelongsTo(() => Chapter, { foreignKey: 'report_chapter_id' })
  chapter: Chapter;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column(DataType.BIGINT)
  report_admin_id: number | null;

  @BelongsTo(() => User, {
    as: 'AdminManageError',
    foreignKey: 'report_admin_id',
  })
  admin: User | null;

  @AllowNull(false)
  @Default(ReportKindOfError.ERROR_IMAGE)
  @Column(
    DataType.ENUM(...Object.values(ReportKindOfError)), // Sử dụng enum
  )
  report_kind_of_error: ReportKindOfError;

  @AllowNull(true)
  @Column(DataType.TEXT)
  report_description: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  is_deleted: boolean;

  @Default(false)
  @Column(DataType.BOOLEAN)
  is_fixed: boolean;

  @CreatedAt
  @Column({ type: DataType.DATE })
  createdAt: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE })
  updatedAt: Date;
}
