import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

@ApiSchema({ description: 'Description of the AddMangaToFavoriteDto schema' })
export class FavoriteDetailsDto {
  @ApiProperty({
    example: 1,
    uniqueItems: true,
  })
  @IsNumber()
  @Type(() => Number)
  manga_id: number;
}
