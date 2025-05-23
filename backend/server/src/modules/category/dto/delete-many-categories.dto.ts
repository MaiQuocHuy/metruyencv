import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsNumber } from 'class-validator';

@ApiSchema({ description: 'Description of the DeleteManyCategories schema' })
export class DeleteManyCategoriesDto {
  @ApiProperty({
    type: [Number],
    description: 'Can delete many categories',
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
  @IsArray({ message: 'category_id must be an array' })
  @IsNumber({}, { each: true, message: 'Each category_id must be a number' }) // Validate that each element is a number
  listCategory: number[];
}
