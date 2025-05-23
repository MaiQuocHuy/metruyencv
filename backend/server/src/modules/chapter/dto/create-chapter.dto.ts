import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateChapterDto {
  @ApiProperty({
    description: 'Chapter title',
    example: 'Chapter 1: The Beginning',
    required: true,
  })
  // @IsOptional()
  @IsString()
  chap_title: string;

  @ApiProperty({
    description: 'Chapter number',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => {
    if (value === '') return -1;
    return Number(value);
  })
  chap_number: number;

  @ApiProperty({
    description:
      'List Cid of chapter content (images), This Cid is uploaded to Pinata by client',
    example: ['Qm...', 'Qm...'],
    type: [String],
  })
  @IsArray({ message: 'list_cid must be an array' })
  @IsString({ each: true })
  list_cid: string[];

  // @ApiProperty({
  //   description: 'Chapter images (upload multiple images)',
  //   type: 'string',
  //   format: 'binary',
  //   isArray: true,
  // })
  // chap_content: Express.Multer.File[];
}
