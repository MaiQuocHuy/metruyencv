import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { CreateMangaDto } from './create-manga.dto';
import {
  isEmpty,
  IsEmpty,
  IsEnum,
  IsOptional,
  Validate,
  ValidateIf,
} from 'class-validator';

export enum MangaStatus {
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  HIATUS = 'hiatus',
}
export class UpdateMangaDto extends PartialType(
  OmitType(CreateMangaDto, ['category_id' as const]),
) {
  @ApiPropertyOptional({
    enum: MangaStatus,
    description: 'The status of the manga',
    example: '',
  })
  @ValidateIf((obj) => !isEmpty(obj.manga_status)) // Nếu rỗng, bỏ qua validation
  @IsEnum(MangaStatus)
  @IsOptional()
  manga_status: MangaStatus;
}
