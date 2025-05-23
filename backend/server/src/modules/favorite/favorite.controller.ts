import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { SwaggerApiOperation } from '@common/constants';
import { ResponseMessage } from '@common/decorators/response-message.decorator';
import { AuthorizeAction } from '@common/decorators/authorize-action.decorator';
import { FavoriteDetailsDto } from './dto/favorite-details.dto';

@ApiBearerAuth()
@ApiTags('Favorite')
@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @ApiOperation({
    summary: 'Add manga to favorite',
    description: `
  - **${SwaggerApiOperation.NEED_AUTH}**
  - Users can add manga to their favorites (follow manga)
    `,
  })
  @ApiConsumes('application/x-www-form-urlencoded')
  @Post('manga-to-favorite')
  @ResponseMessage('Manga added to favorite successfully')
  @AuthorizeAction({ action: 'createOwn', resource: 'Favorites' })
  async addMangaToFavorite(
    // follow manga
    @Req() req: Request,
    @Body() favoriteDetailsDto: FavoriteDetailsDto,
  ) {
    const data = await this.favoriteService.addMangaToFavorite(
      favoriteDetailsDto,
      req['user']['sub'],
    );
    return {
      metadata: req['permission'].filter(data),
    };
  }

  @ApiOperation({
    summary: 'Delete manga to favorite',
    description: `
  - **${SwaggerApiOperation.NEED_AUTH}**
  - Users can delete manga from their favorites (unfollow manga)
    `,
  })
  @ApiConsumes('application/x-www-form-urlencoded')
  @Delete('manga-from-favorite')
  @ResponseMessage('Delete manga from favorite successfully')
  @AuthorizeAction({ action: 'updateOwn', resource: 'Favorites' })
  async deleteMangaFromFavorite(
    // unfollow manga
    @Req() req: Request,
    @Body() favoriteDetailsDto: FavoriteDetailsDto,
  ) {
    const data = await this.favoriteService.deleteMangaFromFavorite(
      favoriteDetailsDto,
      req['user']['sub'],
    );
    return {
      metadata: data,
    };
  }

  @ApiOperation({
    summary: 'Get list manga from favorite',
    description: `
  - **${SwaggerApiOperation.NEED_AUTH}**
  - Users can get list manga from their favorites (list followed manga)
    `,
  })
  @Get('/manga-from-favorite')
  @ResponseMessage('Get list manga from favorite successfully')
  @AuthorizeAction({ action: 'readOwn', resource: 'Favorites' })
  async getListMangaFromFavorite(
    // list followed manga
    @Req() req: Request,
  ) {
    const data = await this.favoriteService.getListMangaFromFavorite(
      req['user']['sub'],
    );
    return {
      metadata: req['permission'].filter(data),
    };
  }
}
