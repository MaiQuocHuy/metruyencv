import { Module } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { ChapterController } from './chapter.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Chapter } from './models/chapter.model';
import { ChapterRepo } from './chapter.repo';
import { CloudinaryModule } from 'src/shared/cloudinary/cloudinary.module';
import { MangaModule } from '@modules/manga/manga.module';
import { PinataModule } from 'src/shared/pinata/pinata.module';
import { Web3Module } from 'src/shared/web3/web3.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Chapter]),
    CloudinaryModule,
    MangaModule,
    PinataModule,
    Web3Module,
  ],
  controllers: [ChapterController],
  providers: [ChapterService, ChapterRepo],
  exports: [SequelizeModule, ChapterService, ChapterRepo],
})
export class ChapterModule {}
