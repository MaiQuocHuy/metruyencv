import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ErrorReport } from './models/error-report.model';
import PaginateUtil from 'src/shared/utils/paginate.util';
import { Op } from 'sequelize';

@Injectable()
export class ErrorReportRepo {
  constructor(
    @InjectModel(ErrorReport) private errorReportModel: typeof ErrorReport,
  ) {}

  async createErrorReport(
    errorReport: ErrorReport,
    options: object = {},
  ): Promise<ErrorReport> {
    return await this.errorReportModel.create(errorReport.toJSON(), options);
  }

  async getListOfErrorReportWithPaginate(
    isFixed: boolean,
    isManaged: boolean,
    page: number,
    limit: number,
    options: object = {},
  ): Promise<any> {
    const offset = (page - 1) * limit;
    const whereCondition: any = { is_fixed: isFixed };

    // Nếu isManaged = true, lấy các report đã có admin xử lý
    // Nếu isManaged = false, lấy các report chưa có admin xử lý
    if (isManaged) {
      whereCondition.report_admin_id = { [Op.ne]: null };
    } else {
      whereCondition.report_admin_id = null;
    }
    const { rows: data, count: total } =
      await this.errorReportModel.findAndCountAll({
        where: whereCondition,
        ...options,
        limit,
        offset,
        order: [['updatedAt', 'DESC']],
      });
    return {
      data,
      pagination: PaginateUtil.paginationReturn({ page, total, limit, offset }),
    };
  }

  async findErrorReportById(
    errorReportId: number,
    options: object = {},
  ): Promise<ErrorReport> {
    return await this.errorReportModel.findOne({
      where: { report_id: errorReportId },
      ...options,
    });
  }

  async updateErrorReport(
    errorReportId: number,
    errorReport: Partial<ErrorReport>,
    options: object = {},
  ): Promise<number> {
    const [affectedCount] = await this.errorReportModel.update(
      errorReport.toJSON(),
      {
        where: { report_id: errorReportId },
        ...options,
      },
    );
    return affectedCount;
  }

  async deleteErrorReportById(
    errorReportId: number,
    options: object = {},
  ): Promise<number> {
    return await this.errorReportModel.destroy({
      where: { report_id: errorReportId },
      ...options,
    });
  }
}
