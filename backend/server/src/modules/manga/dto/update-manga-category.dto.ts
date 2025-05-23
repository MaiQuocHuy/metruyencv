import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsNumber, IsOptional } from 'class-validator';

export class UpdateMangaCategoryDto {
  @ApiPropertyOptional({
    type: [Number],
    description: 'New category will be added',
  })
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
  @IsOptional()
  @IsArray({ message: 'category_id must be an array' })
  @IsNumber({}, { each: true, message: 'Each category_id must be a number' }) // Validate that each element is a number
  listNewCategoryId: number[];

  @ApiPropertyOptional({
    type: [Number],
    description: 'Category will be remove',
  })
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
  @IsOptional()
  @IsArray({ message: 'category_id must be an array' })
  @IsNumber({}, { each: true, message: 'Each category_id must be a number' }) // Validate that each element is a number
  listRemoveCategoryId: number[];
}
