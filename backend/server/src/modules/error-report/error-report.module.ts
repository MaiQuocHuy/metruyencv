import { Module } from '@nestjs/common';
import { ErrorReportService } from './error-report.service';
import { ErrorReportController } from './error-report.controller';
import { ErrorReportRepo } from './error-report.repo';
import { SequelizeModule } from '@nestjs/sequelize';
import { ErrorReport } from './models/error-report.model';
import { UserModule } from '@modules/user/user.module';
import { ChapterModule } from '@modules/chapter/chapter.module';

@Module({
  imports: [
    SequelizeModule.forFeature([ErrorReport]),
    UserModule,
    ChapterModule,
  ],
  controllers: [ErrorReportController],
  providers: [ErrorReportService, ErrorReportRepo],
})
export class ErrorReportModule {}
