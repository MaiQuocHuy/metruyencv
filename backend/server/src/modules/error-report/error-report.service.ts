import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateErrorReportDto } from './dto/create-error-report.dto';
import { UserService } from '@modules/user/user.service';
import { ChapterService } from '@modules/chapter/chapter.service';
import { ErrorReportRepo } from './error-report.repo';
import { ErrorReport } from './models/error-report.model';
import Util from '@common/services/util.service';
import { PaginatedDto } from 'src/shared/dto/paginate.dto';
import { ErrorReportDto } from './dto/error-report.dto';
import PaginateUtil from 'src/shared/utils/paginate.util';
import { Chapter } from '@modules/chapter/models/chapter.model';
import { Manga } from '@modules/manga/models/manga.model';
import { User } from '@modules/user/models/user.model';

@Injectable()
export class ErrorReportService {
  constructor(
    private readonly errorReportRepo: ErrorReportRepo,
    private readonly userService: UserService,
    private readonly chapterService: ChapterService,
    private readonly util: Util,
  ) {}

  async createErrorReport(
    createErrorReportDto: CreateErrorReportDto,
    userId: number,
  ): Promise<ErrorReport> {
    const { report_chapter_id, report_description, report_kind_of_error } =
      createErrorReportDto;

    const foundUser = await this.userService.getDetailsInfo(userId);
    if (!foundUser) {
      throw new Error('User not found');
    }

    // Check and return an error if the chapter is not found (returns an Error that is handled in findChapterById)
    await this.chapterService.findChapterById(report_chapter_id);

    const errorReportId = this.util.generateIdByTime({ fitWithInteger: true });
    const errorReportObj = new ErrorReport({
      report_id: errorReportId,
      report_user_id: userId,
      report_chapter_id,
      report_description,
      report_kind_of_error,
    });

    const newErrorReport =
      await this.errorReportRepo.createErrorReport(errorReportObj);

    return newErrorReport.get({ plain: true });
  }

  async getListErrorReportWithPaginate(
    paginateDto: PaginatedDto<ErrorReportDto>,
    isFixed: boolean,
    isManaged: boolean,
  ): Promise<PaginatedDto<ErrorReportDto>> {
    if (isFixed === false && isManaged === true) {
      throw new HttpException(
        'Cannot get list error report',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (isFixed && !isManaged) {
      throw new HttpException(
        'Cannot get list error report',
        HttpStatus.BAD_REQUEST,
      );
    }

    const page = paginateDto.page;
    const limit = paginateDto.limit;
    const includeCondition = [
      {
        model: Chapter,
        as: 'chapter',
        attributes: ['chap_number', 'chap_title'],
        include: [
          {
            model: Manga,
            attributes: ['manga_title'],
          },
        ],
      },
    ];
    const { data, pagination } =
      await this.errorReportRepo.getListOfErrorReportWithPaginate(
        isFixed,
        isManaged,
        page,
        limit,
        {
          include: includeCondition,
          nest: true,
        },
      );

    const dataToReturn = data.map((item) => {
      return item.get({ plain: true });
    });
    paginateDto = PaginateUtil.setPaginateDto(
      paginateDto,
      dataToReturn,
      pagination,
    );
    return paginateDto;
  }

  async confirmFixErrorReport(
    errorReportId: number,
    adminId: number,
  ): Promise<number> {
    const errorReport =
      await this.errorReportRepo.findErrorReportById(errorReportId);

    if (errorReport.is_fixed)
      throw new HttpException(
        'Error report already fixed',
        HttpStatus.BAD_REQUEST,
      );

    errorReport.is_fixed = true;
    errorReport.report_admin_id = adminId;
    const isUpdated = await this.errorReportRepo.updateErrorReport(
      errorReportId,
      errorReport,
    );
    if (!isUpdated) {
      throw new Error('Cannot confirm fix error report');
    }
    return isUpdated;
  }

  async confirmManageErrorReportByAdmin(
    errorReportId: number,
    adminId: number,
  ): Promise<number> {
    const errorReport =
      await this.errorReportRepo.findErrorReportById(errorReportId);

    if (errorReport.is_fixed)
      throw new HttpException(
        'Error report already fixed',
        HttpStatus.BAD_REQUEST,
      );

    if (errorReport.report_admin_id)
      throw new HttpException(
        'Error reporting is being managed',
        HttpStatus.BAD_REQUEST,
      );

    errorReport.report_admin_id = adminId;
    const isUpdated = await this.errorReportRepo.updateErrorReport(
      errorReportId,
      errorReport,
    );
    if (!isUpdated) {
      throw new Error('Cannot confirm manage error report');
    }
    return isUpdated;
  }

  async deleteErrorReportById(errorReportId: number): Promise<number> {
    await this.errorReportRepo.findErrorReportById(errorReportId);

    const isDeleted =
      await this.errorReportRepo.deleteErrorReportById(errorReportId);
    if (!isDeleted) {
      throw new Error('Cannot delete error report');
    }
    return isDeleted;
  }

  async findErrorReportById(errorReportId: number): Promise<ErrorReport> {
    const errorReport =
      await this.errorReportRepo.findErrorReportById(errorReportId);
    if (!errorReport) {
      throw new Error('Error report not found');
    }
    return errorReport;
  }

  async getDetailsErrorReport(errorReportId: number): Promise<ErrorReportDto> {
    const includeCondition = [
      {
        model: User,
        as: 'UserReportError',
        attributes: ['usr_id', 'usr_name'],
      },
      {
        model: User,
        as: 'AdminManageError',
        attributes: ['usr_id', 'usr_name'],
      },
    ];
    const foundErrorReport = await this.errorReportRepo.findErrorReportById(
      errorReportId,
      {
        include: includeCondition,
      },
    );
    return foundErrorReport.get({ plain: true });
  }
}
