import { PartialType } from '@nestjs/swagger';
import { ErrorReport } from '../models/error-report.model';

export class ErrorReportDto extends PartialType(ErrorReport) {}
