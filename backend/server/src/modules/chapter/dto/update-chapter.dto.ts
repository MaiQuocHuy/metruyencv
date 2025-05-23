import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateChapterDto } from './create-chapter.dto';
import {
  ArrayNotEmpty,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class UpdateChapterDto extends PartialType(
  OmitType(CreateChapterDto, ['list_cid'] as const),
) {
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

  @ApiProperty({
    description: `Array containing image will change.
    "**chap_img_pages**" have to equal with "**chap_content**"
    and "**chap_img_pages**" will corresponding with "**chap_content**`,
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: false,
  })
  chap_content: Express.Multer.File[];
}
