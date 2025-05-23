import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, Max } from 'class-validator';
import { IsInt, Min } from 'class-validator';

export class PaginatedDto<TData> {
  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiHideProperty()
  total: number;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  limit: number = 20;

  @ApiHideProperty()
  offset: number;

  @ApiHideProperty()
  totalPages: number;

  results: TData[];
}
