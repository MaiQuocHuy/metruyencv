import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

@ApiSchema({ description: 'Description of the CreateCategoryDto schema' })
export class CreateCategoryDto {
  @IsString({ message: 'Category is not in correct format ' })
  @IsNotEmpty({ message: 'Category name is required' })
  @ApiProperty({
    uniqueItems: true,
  })
  category_name: string;
}
