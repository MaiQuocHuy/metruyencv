import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

@ApiSchema({ description: 'Description of the CreateCommentDto schema' })
export class CreateCommentDto {
  @ApiProperty({
    uniqueItems: true,
  })
  @IsNotEmpty({ message: 'Chapter id is required' })
  @IsNumber()
  @Transform(({ value }) => {
    if (value === '') return -1;
    return Number(value);
  })
  comment_chapter_id: number;

  @ApiProperty({
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => {
    if (value === '') return -1;
    return Number(value);
  })
  comment_parent_id?: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Content is required' })
  @IsString()
  comment_content: string;
}
