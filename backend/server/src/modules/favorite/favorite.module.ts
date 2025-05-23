import { Module } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Favorite } from './models/favorite.model';
import { FavoriteRepo } from './favorite.repo';
import { FavoriteDetail } from './models/favorite-details.model';
import { MangaModule } from '@modules/manga/manga.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Favorite, FavoriteDetail]),
    MangaModule,
  ],
  controllers: [FavoriteController],
  providers: [FavoriteService, FavoriteRepo],
  exports: [SequelizeModule, FavoriteRepo, FavoriteService],
})
export class FavoriteModule {}
