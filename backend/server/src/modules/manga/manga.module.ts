import { Module } from '@nestjs/common';
import { MangaService } from './manga.service';
import { MangaController } from './manga.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Manga } from './models/manga.model';
import { MangaRepo } from './manga.repo';
import { MangaCategory } from './models/manga-category.model';
import { ChapterModule } from '@modules/chapter/chapter.module';
import { Web3Module } from 'src/shared/web3/web3.module';
import { PinataModule } from 'src/shared/pinata/pinata.module';
import { CacheModule } from 'src/shared/cache/cache.module';
import { UserMangaChapter } from './models/manga-chapter-user-being-read';
import { CategoryModule } from '@modules/category/category.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Manga, MangaCategory, UserMangaChapter]),
    Web3Module,
    PinataModule,
    CategoryModule,
    CacheModule,
  ],
  controllers: [MangaController],
  providers: [MangaService, MangaRepo],
  exports: [MangaService, MangaRepo],
})
export class MangaModule {}
