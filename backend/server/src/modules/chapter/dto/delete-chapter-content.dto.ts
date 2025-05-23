import { ApiProperty, PickType } from '@nestjs/swagger';
import { UpdateChapterDto } from './update-chapter.dto';
import { Transform } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNumber, IsString } from 'class-validator';

export class DeleteChapterContentDto {
  @ApiProperty({
    description: `Array containing cid of image will change.`,
    type: 'array',
    items: { type: 'string' },
    required: true,
  })
  @IsArray({ message: 'chap_content_cid must be an array' })
  @ArrayNotEmpty({ message: 'chap_content_cid cannot be empty' })
  @IsString({ each: true, message: 'Each CID must be a string' })
  @Transform(({ value }) => {
    // Handle both string and array inputs
    if (typeof value === 'string') {
      return value.split(',');
    }
    return value;
  })
  chap_content_cid: string[];
}
