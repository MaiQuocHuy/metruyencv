import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MangaStatus } from './update-manga.dto';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  ValidateBy,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { OnlyOneFieldValidator } from 'src/shared/dto/only-one-field.validator';

export class SearchMangaDto {
  // @ApiProperty({
  //   required: true,
  //   description: 'Manga is publish or unpublish',
  //   example: false,
  // })
  // @IsBoolean()
  // is_draft: boolean;

  @ApiPropertyOptional({
    enum: MangaStatus,
    description: 'The status of the manga',
    // example: MangaStatus.ONGOING,
  })
  @IsEnum(MangaStatus, { message: 'Invalid manga status' })
  @IsOptional()
  manga_status: MangaStatus;

  @ApiProperty({
    required: false,
    description: 'Manga category id',
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  category_id: number;

  @ApiProperty({
    required: false,
    description: 'Search manga by keyword',
  })
  @IsOptional()
  @IsString()
  keyword: string;

  @ApiProperty({
    required: false,
    description: 'Sort By new updated',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  updatedAt: boolean;

  @ApiProperty({
    required: false,
    description: 'Sort by new created',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  createdAt: boolean;

  @ApiProperty({
    required: false,
    description: 'Sort by views',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  manga_views: boolean;

  @ApiProperty({
    required: false,
    description: 'Sort by top follows',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  manga_number_of_followers: boolean;

  @ValidateBy({
    name: 'OnlyOneSortField',
    validator: OnlyOneFieldValidator,
    constraints: [
      'updatedAt',
      'createdAt',
      'manga_views',
      'manga_number_of_followers',
    ],
  })
  validateSortFields: boolean;
}
