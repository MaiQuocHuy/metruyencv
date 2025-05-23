import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Chapter } from './models/chapter.model';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class ChapterRepo {
  constructor(
    @InjectModel(Chapter) private chapterModel: typeof Chapter,
    private sequelize: Sequelize,
  ) {}

  async createChapter(
    chapter: Chapter,
    options: object = {},
  ): Promise<Chapter> {
    return await this.chapterModel.create(chapter.toJSON(), options);
  }

  async updateChapter(chapter: Chapter, options: object = {}): Promise<number> {
    const [affectedCount] = await this.chapterModel.update(chapter.toJSON(), {
      where: { chap_id: chapter.chap_id },
      ...options,
    });
    return affectedCount;
  }

  async findChapterById(
    chapId: number,
    {
      isDeleted = false,
      options = {},
    }: { isDeleted?: boolean; options?: object } = {},
  ): Promise<Chapter> {
    return await this.chapterModel.findOne({
      where: {
        chap_id: chapId,
        is_deleted: isDeleted,
      },
      ...options,
    });
  }

  async getAllChaptersByMangaId(
    mangaId: number,
    {
      isDeleted = false,
      options = {},
    }: { isDeleted?: boolean; options?: object } = {},
  ): Promise<Chapter[]> {
    return await this.chapterModel.findAll({
      where: {
        chap_manga_id: mangaId,
        is_deleted: isDeleted,
      },
      order: [['createdAt', 'DESC']],
      ...options,
    });
  }

  async getNumberOfChapters(mangaId: number): Promise<number> {
    return await this.chapterModel.max('chap_number', {
      where: {
        chap_manga_id: mangaId,
      },
    });
  }

  async getDetailsOfChapterByChapterId(
    chapterId: number,
    {
      isDeleted = false,
      options = {},
    }: { isDeleted?: boolean; options?: object } = {},
  ): Promise<Chapter> {
    return await this.chapterModel.findOne({
      where: {
        chap_id: chapterId,
        is_deleted: isDeleted,
      },
      ...options,
    });
  }

  async increaseViewOfChapter(
    chapterId: number,
    options = {},
  ): Promise<number> {
    const [affectedCount] = await this.chapterModel.update(
      {
        chap_views: this.sequelize.literal('chap_views + 1'), // Tăng giá trị chap_views lên 1
      },
      {
        where: {
          chap_id: chapterId,
        },
        ...options,
      },
    );

    return affectedCount;
  }

  async deleteChapterById(
    chapId: number,
    options: object = {},
  ): Promise<number> {
    const [affectedCount] = await this.chapterModel.update(
      { is_deleted: true },
      { where: { chap_id: chapId }, ...options },
    );
    return affectedCount;
  }
}
