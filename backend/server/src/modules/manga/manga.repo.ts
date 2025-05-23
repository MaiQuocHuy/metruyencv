import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Manga } from './models/manga.model';
import { MangaCategory } from './models/manga-category.model';
import { Attributes, where } from 'sequelize';
import { Op, literal } from 'sequelize';
import { Category } from '@modules/category/models/category.model';
import PaginateUtil from 'src/shared/utils/paginate.util';
import { SearchMangaDto } from './dto/search-manga.dto';
import { UserMangaChapter } from './models/manga-chapter-user-being-read';

@Injectable()
export class MangaRepo {
  constructor(
    @InjectModel(Manga) private mangaModel: typeof Manga,
    @InjectModel(MangaCategory)
    private mangaCategoryModel: typeof MangaCategory,
    @InjectModel(UserMangaChapter)
    private userMangaChapter: typeof UserMangaChapter,
  ) {}

  async createNewManga(manga: Manga, options: object = {}): Promise<Manga> {
    return await this.mangaModel.create(manga.toJSON(), options);
  }

  async findMangaById(
    whereConditions: any,
    // mangaId: number,
    // is_deleted: boolean = false,
    // is_draft: boolean = false,
  ): Promise<Manga> {
    return await this.mangaModel.findOne({
      where: whereConditions,
    });
  }

  async addMangaCategory(
    mangaCategory: Attributes<MangaCategory>[],
    options: object = {},
  ): Promise<MangaCategory[]> {
    return await this.mangaCategoryModel.bulkCreate(mangaCategory, options);
  }

  async updateManga(manga: Manga, options: object = {}): Promise<number> {
    const [affectedCount] = await this.mangaModel.update(manga.toJSON(), {
      where: { manga_id: manga.manga_id },
      ...options,
    });
    return affectedCount;
  }

  async deleteMangaCategory(
    mangaCategory: Attributes<MangaCategory>[],
    options: object = {},
  ): Promise<number> {
    return await this.mangaCategoryModel.destroy({
      where: {
        [Op.or]: mangaCategory,
      },
      ...options,
    });
  }

  async publishMangaById(
    mangaId: number,
    options: object = {},
  ): Promise<number> {
    const [affectedCount] = await this.mangaModel.update(
      { is_published: true, is_draft: false },
      { where: { manga_id: mangaId }, ...options },
    );
    return affectedCount;
  }

  async unpublishMangaById(
    mangaId: number,
    options: object = {},
  ): Promise<number> {
    const [affectedCount] = await this.mangaModel.update(
      { is_published: false, is_draft: true },
      { where: { manga_id: mangaId }, ...options },
    );
    return affectedCount;
  }

  async deleteMangaById(
    mangaId: number,
    options: object = {},
  ): Promise<number> {
    const [affectedCount] = await this.mangaModel.update(
      { is_deleted: true, is_draft: false, is_published: false },
      { where: { manga_id: mangaId }, ...options },
    );
    return affectedCount;
  }

  async searchManga(
    page: number,
    limit: number,
    whereConditions: any[],
    order: any[],
    includeConditions: any[],
    option: object = {},
  ): Promise<any> {
    const offset = (page - 1) * limit;

    const { rows: data, count: total } = await this.mangaModel.findAndCountAll({
      where: {
        [Op.and]: whereConditions,
      },
      include: includeConditions,
      order,
      limit,
      offset,
      ...option,
    });
    return {
      data,
      pagination: PaginateUtil.paginationReturn({ page, total, limit, offset }),
    };
  }

  async getAllUnpublishManga(option: object = {}): Promise<Array<Manga>> {
    return await this.mangaModel.findAll({
      where: { is_draft: true, is_published: false, is_deleted: false },
      order: [['updatedAt', 'DESC']],
      ...option,
    });
  }

  async getAllPublishManga(option: object = {}): Promise<Array<Manga>> {
    return await this.mangaModel.findAll({
      where: { is_draft: false, is_published: true, is_deleted: false },
      order: [['updatedAt', 'DESC']],
      ...option,
    });
  }

  async getAllPublishMangaPaginate(
    page: number,
    limit: number,
    option: object = {},
  ): Promise<any> {
    const offset = (page - 1) * limit;
    const { rows: data, count: total } = await this.mangaModel.findAndCountAll({
      where: { is_published: true, is_draft: false, is_deleted: false },
      ...option,
      limit,
      offset,
      order: [['updatedAt', 'DESC']],
    });
    return {
      data,
      pagination: PaginateUtil.paginationReturn({ page, total, limit, offset }),
    };
  }

  async getAllUnPublishMangaPaginate(
    page: number,
    limit: number,
    option: object = {},
  ): Promise<any> {
    const offset = (page - 1) * limit;
    const { rows: data, count: total } = await this.mangaModel.findAndCountAll({
      where: { is_draft: true, is_published: false, is_deleted: false },
      ...option,
      limit,
      offset,
      order: [['updatedAt', 'DESC']],
    });
    return {
      data,
      pagination: PaginateUtil.paginationReturn({ page, total, limit, offset }),
    };
  }

  async getDetailsManga(
    mangaId: number,
    whereConditions: any[] = [],
    options: object = {},
  ): Promise<Manga> {
    whereConditions.push({ manga_id: mangaId });

    const includeConditions = [
      {
        model: Category,
        as: 'categories',
        through: { attributes: [] },
        attributes: ['category_id', 'category_name'],
      },
    ];
    return await this.mangaModel.findOne({
      where: { [Op.and]: whereConditions },
      include: includeConditions,
      ...options,
    });
  }

  async saveChapterUserBeingRead(
    {
      mangaId,
      chapNumber,
      userId,
    }: { mangaId: number; chapNumber: number; userId: number },
    options: object = {},
  ): Promise<UserMangaChapter> {
    return await this.userMangaChapter.create(
      { manga_id: mangaId, user_id: userId, chapter_being_read: chapNumber },
      options,
    );
  }

  async deleteChapterUserBeingRead(
    { mangaId, userId }: { mangaId: number; userId: number },
    options: object = {},
  ): Promise<number> {
    return await this.userMangaChapter.destroy({
      where: { manga_id: mangaId, user_id: userId },
      ...options,
    });
  }

  async increaseViewOfManga(
    mangaId: number,
    options: object = {},
  ): Promise<number> {
    const [affectedCount] = await this.mangaModel.update(
      {
        manga_views: literal('manga_views + 1'), // Tăng giá trị manga_views lên 1
      },
      {
        where: { manga_id: mangaId },
        ...options,
      },
    );

    return affectedCount;
  }
}
