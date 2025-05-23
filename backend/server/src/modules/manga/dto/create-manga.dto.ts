import { ApiProperty, ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

@ApiSchema({ description: 'Description of the CreateMangaDto schema' })
export class CreateMangaDto {
  @ApiProperty()
  @IsString({ message: 'Invalid format' })
  manga_title: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  manga_thumb: Express.Multer.File;

  @ApiProperty()
  @IsString({ message: 'Invalid format' })
  manga_author: string;

  @ApiProperty({ type: [Number] })
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
  @IsArray({ message: 'category_id must be an array' })
  @IsNumber({}, { each: true, message: 'Each category_id must be a number' }) // Validate that each element is a number
  category_id: number[];

  @ApiPropertyOptional()
  @IsString({ message: 'Invalid format' })
  @IsOptional()
  manga_description: string;
}
