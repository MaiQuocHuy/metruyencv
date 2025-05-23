import { ApiProperty, ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ReportKindOfError } from '../enums/report-kind-of-error.enum';
import { Transform } from 'class-transformer';

@ApiSchema({ description: 'Description of the CreateErrorReportDto schema' })
export class CreateErrorReportDto {
  // @ApiProperty({ description: 'Report user ID' })
  // @IsNumber({}, { message: 'Report user ID must be a number' })
  // @Transform(({ value }) => {
  //   if (value === '') return -1;
  //   return Number(value);
  // })
  // report_user_id: number;

  @ApiProperty({ description: 'Report chapter ID' })
  @IsNumber({}, { message: 'Report chapter ID must be a number' })
  @Transform(({ value }) => {
    if (value === '') return -1;
    return Number(value);
  })
  report_chapter_id: number;

  @ApiProperty({
    enum: ReportKindOfError,
    description: 'Kind of error',
  })
  @IsEnum(ReportKindOfError)
  report_kind_of_error: ReportKindOfError;

  @ApiPropertyOptional({ description: 'Report description' })
  @IsString({ message: 'Report description must be a string' })
  @IsOptional()
  report_description: string;
}
