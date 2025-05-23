import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  isArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;

  @ApiProperty()
  @IsNotEmpty()
  @IsString({ message: 'Invalid format' })
  manga_title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString({ message: 'Invalid format' })
  manga_author: string;

  @ApiPropertyOptional()
  @IsString({ message: 'Invalid format' })
  @IsOptional()
  manga_description: string;

  @ApiProperty({
    description: `Array containing page numbers will be changed.`,
    type: [Number],
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    // Handle both string and array inputs
    if (!value.length) return [];
    else if (typeof value === 'string') {
      return value.split(',').map(Number);
    } else if (Array.isArray(value)) {
      return value.map(Number);
    }
    return value;
  })
  @IsArray({ message: 'chap_img_pages must be an array' })
  @IsNumber({}, { each: true })
  chap_img_pages?: number[];
}
