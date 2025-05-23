import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FavoriteRepo } from './favorite.repo';
import { FavoriteDetail } from './models/favorite-details.model';
import { FavoriteDetailsDto } from './dto/favorite-details.dto';
import { MangaService } from '@modules/manga/manga.service';

@Injectable()
export class FavoriteService {
  constructor(
    private readonly favoriteRepo: FavoriteRepo,
    private readonly mangaService: MangaService,
  ) {}
  async addMangaToFavorite(
    favoriteDetailsDto: FavoriteDetailsDto,
    fav_user_id: number,
  ): Promise<FavoriteDetail> {
    const foundFavorite =
      await this.favoriteRepo.findFavoriteByUserId(fav_user_id);
    if (!foundFavorite)
      throw new HttpException('Not found favorite', HttpStatus.BAD_REQUEST);

    const isMangaExistsInFavorite = await this.favoriteRepo.findMangaInFavorite(
      favoriteDetailsDto.manga_id,
      foundFavorite.fav_id,
    );
    if (isMangaExistsInFavorite)
      throw new HttpException(
        'Manga is exists in favorite',
        HttpStatus.BAD_REQUEST,
      );

    // find manga is exist or not (manga is not deleted and is published)
    await this.mangaService.findMangaById(favoriteDetailsDto.manga_id);
    const favoriteDetails = await this.favoriteRepo.addMangaToFavorite(
      new FavoriteDetail({
        manga_id: favoriteDetailsDto.manga_id,
        fav_id: foundFavorite.fav_id,
      }),
    );
    if (!favoriteDetails)
      throw new HttpException(
        'Failed to add manga to favorite',
        HttpStatus.BAD_REQUEST,
      );
    return favoriteDetails.get({ plain: true });
  }

  async deleteMangaFromFavorite(
    favoriteDetailsDto: FavoriteDetailsDto,
    fav_user_id: number,
  ): Promise<number> {
    const foundFavorite =
      await this.favoriteRepo.findFavoriteByUserId(fav_user_id);
    if (!foundFavorite)
      throw new HttpException('Not found favorite', HttpStatus.BAD_REQUEST);

    const isDeleted = await this.favoriteRepo.deleteMangaFromFavorite({
      fav_id: foundFavorite.fav_id,
      manga_id: favoriteDetailsDto.manga_id,
    });
    if (!isDeleted)
      throw new HttpException(
        'Failed to delete manga from favorite',
        HttpStatus.BAD_REQUEST,
      );
    return isDeleted;
  }

  async getListMangaFromFavorite(
    fav_user_id: number,
  ): Promise<FavoriteDetail[]> {
    const foundFavorite =
      await this.favoriteRepo.findFavoriteByUserId(fav_user_id);
    if (!foundFavorite)
      throw new HttpException('Not found favorite', HttpStatus.BAD_REQUEST);

    const listMangaFromFavorite =
      await this.favoriteRepo.getListMangaFromFavorite(foundFavorite.fav_id, {
        nest: true,
      });
    return listMangaFromFavorite.map((value) => {
      return value.get({ plain: true });
    });
  }
}
