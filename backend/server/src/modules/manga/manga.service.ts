/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MangaRepo } from './manga.repo';
import { CreateMangaDto } from './dto/create-manga.dto';
import Util from '@common/services/util.service';
import { Manga } from './models/manga.model';
import { Sequelize } from 'sequelize-typescript';
import { UpdateMangaDto } from './dto/update-manga.dto';
import { MangaCategory } from './models/manga-category.model';
import { MangaDto } from './dto/manga.dto';
import { PaginatedDto } from 'src/shared/dto/paginate.dto';
import PaginateUtil from 'src/shared/utils/paginate.util';
import { SearchMangaDto } from './dto/search-manga.dto';
import { literal } from 'sequelize';
import { Category } from '@modules/category/models/category.model';
import CommonUtil from 'src/shared/utils/common.util';
import { HistoryType } from 'src/shared/utils/enums.util';
import { Web3Service } from 'src/shared/web3/web3.service';
import { PinataService } from 'src/shared/pinata/pinata.service';
import { ContractTransaction } from 'ethers';
import { CacheService } from 'src/shared/cache/cache.service';
import { omit } from 'lodash';
import { CategoryService } from '@modules/category/category.service';
import { UserService } from '@modules/user/user.service';
import { ContractName as ContractNameConst } from '@common/constants';
import { Http } from 'winston/lib/winston/transports';

@Injectable()
export class MangaService {
  constructor(
    private mangaRepo: MangaRepo,
    private util: Util,
    private sequelize: Sequelize,
    private web3Service: Web3Service,
    private pinataService: PinataService,
    private cacheService: CacheService,
    private categoryService: CategoryService,
  ) {}

  async getCidStorageContractAddress() {
    return await this.web3Service.getContractAddressByName(
      ContractNameConst.CID_STORAGE,
    );
  }

  async createManga(
    createMangaDto: CreateMangaDto,
    mangaThumb: Express.Multer.File,
  ) {
    const mangaId = this.util.generateIdByTime();
    const mangaSlug = this.util.generateSlug([
      createMangaDto.manga_title,
      Math.floor(mangaId / 1000).toString(),
    ]);

    const { category_id } = createMangaDto;
    const rest = omit(createMangaDto, ['category_id', 'manga_thumb']);
    const folderName = `${rest.manga_title}-history`;

    // Create manga
    const result = await this.sequelize.transaction(async (t) => {
      const uploadThumb = await this.pinataService.uploadFile(
        mangaThumb,
        `${rest.manga_title}-thumb`,
        folderName,
      );
      const manga = await this.mangaRepo.createNewManga(
        new Manga({
          ...rest,
          manga_id: mangaId,
          manga_slug: mangaSlug,
          manga_thumb: uploadThumb['IpfsHash'],
        }),
        { transaction: t },
      );

      const { changes: mangaCategories } = await this.addMangaCategory(
        { listNewCategoryId: category_id },
        mangaId,
        {
          transaction: t,
        },
        true, //isCreateManga
      );

      // Upload history create manga to pinata
      const jsonBufferHistory = CommonUtil.createMangaJsonBufferHistory(
        HistoryType.CreateManga,
        0,
        {
          changes: [
            {
              ...rest,
              manga_id: mangaId,
              manga_slug: mangaSlug,
              manga_thumb: uploadThumb['IpfsHash'],
              categories: mangaCategories.map((item) => item),
            },
          ],
        },
      );

      const uploadJson = await this.pinataService.uploadFile(
        jsonBufferHistory,
        `${rest.manga_title}-history-v0`,
        folderName,
      );

      // call smart contract to create a transaction in blockchain
      const tx = await this.web3Service
        .updateManga(mangaId, uploadJson['IpfsHash'])
        .catch(async (err) => {
          await this.pinataService.deleteFilesByCid([uploadJson['IpfsHash']]);
          throw new HttpException(
            'Something wrong when create manga',
            HttpStatus.BAD_REQUEST,
          );
        });

      return manga;
    });

    return { result };
  }

  async updateManga(
    mangaId: number,
    updateMangaDto: UpdateMangaDto,
    mangaThumb: Express.Multer.File,
  ): Promise<number> {
    const foundManga = await this.findMangaByIdCanPublishOrUnPublish(mangaId);
    const folderName = `${foundManga.manga_title}-history`;
    const changes: { field: string; oldValue: any; newValue: any }[] = [];

    Object.entries(updateMangaDto).forEach(([key, value]) => {
      if (value !== undefined && foundManga[key] !== value) {
        changes.push({
          field: key,
          oldValue: foundManga[key],
          newValue: value,
        });
        foundManga[key] = value; // Only replace keys with new values

        // check and update manga_slug when manga_title is updated
        if (key == 'manga_title') {
          const newMangaSlug = this.util.generateSlug([
            updateMangaDto.manga_title,
            Math.floor(mangaId / 1000).toString(),
          ]);
          changes.push({
            field: 'manga_slug',
            oldValue: foundManga.manga_slug,
            newValue: newMangaSlug,
          });
          foundManga.manga_slug = newMangaSlug;
        }
      }
    });

    // check and upload manga thumb
    let uploadThumb: any;
    if (mangaThumb) {
      uploadThumb = await this.pinataService.uploadFile(
        mangaThumb,
        `${foundManga.manga_title}-thumb`,
        folderName,
      );
      changes.push({
        field: 'manga_thumb',
        oldValue: foundManga.manga_thumb,
        newValue: uploadThumb['IpfsHash'],
      });
      foundManga.manga_thumb = uploadThumb['IpfsHash'];
    }
    // check if there is no change, not need to update
    if (changes.length == 0)
      throw new HttpException('No changes to update', HttpStatus.BAD_REQUEST);

    // update manga
    const result = await this.sequelize.transaction(async (t) => {
      const isUpdatedManga = await this.mangaRepo.updateManga(foundManga, {
        transaction: t,
      });
      if (!isUpdatedManga)
        throw new HttpException('Can not update Manga', HttpStatus.BAD_REQUEST);

      await this.createHistoryOfUpdateManga(
        HistoryType.UpdateManga,
        mangaId,
        folderName,
        { changes: changes },
      );

      return isUpdatedManga;
    });

    // delete cache
    const cacheKey = foundManga.is_draft
      ? `manga:unpublish:${mangaId}`
      : `manga:${mangaId}`;
    await this.cacheService.delete(cacheKey);

    return result;
  }

  async addMangaCategory(
    {
      listNewCategoryId = [],
      listRemoveCategoryId = [],
    }: { listNewCategoryId: number[]; listRemoveCategoryId?: number[] },
    mangaId: number,
    options: object = {},
    isCreateManga: boolean = false,
  ): Promise<{
    mangaCategories: MangaCategory[] | boolean;
    changes?: {
      field: string;
      newCategoryId?: any;
      newCategoryName?: any;
      removeCategoryId?: any;
      removeCategoryName?: any;
    }[];
  }> {
    const changes: {
      field: string;
      newCategoryId?: any;
      newCategoryName?: any;
      removeCategoryId?: any;
      removeCategoryName?: any;
    }[] = [];
    let foundManga: Manga;
    if (!isCreateManga) {
      foundManga = await this.findMangaByIdCanPublishOrUnPublish(mangaId);
    }

    let mangaCategory: any = [];
    if (listNewCategoryId.length > 0) {
      mangaCategory = await Promise.all(
        listNewCategoryId.map(async (categoryId, index) => {
          const category =
            await this.categoryService.getCategoryById(categoryId);
          changes.push({
            field: 'category_id',
            newCategoryId: categoryId,
            newCategoryName: category.category_name,
          });
          return { category_id: categoryId, manga_id: mangaId };
        }),
      );
    }

    let mangaCategories: MangaCategory[] | boolean;
    if (isCreateManga) {
      mangaCategories = await this.mangaRepo.addMangaCategory(
        mangaCategory,
        options,
      );
    } else {
      mangaCategories = await this.sequelize.transaction(async (t) => {
        if (listNewCategoryId.length > 0) {
          mangaCategories = await this.mangaRepo.addMangaCategory(
            mangaCategory,
            {
              transaction: t,
            },
          );
        }

        if (listRemoveCategoryId.length > 0) {
          const deleteMangaCategories = await Promise.all(
            listRemoveCategoryId.map(async (categoryId) => {
              const category =
                await this.categoryService.getCategoryById(categoryId);
              changes.push({
                field: 'category_id',
                removeCategoryId: categoryId,
                removeCategoryName: category.category_name,
              });
              return { category_id: categoryId, manga_id: mangaId };
            }),
          );
          await this.mangaRepo.deleteMangaCategory(deleteMangaCategories, {
            transaction: t,
          });
        }

        await this.createHistoryOfUpdateManga(
          HistoryType.UpdateCategoryForManga,
          mangaId,
          `${foundManga.manga_title}-history`,
          { changes: changes },
        );

        // const result = mangaCategories.map((category) => category.dataValues);
        return true;
      });
    }

    if (!isCreateManga) {
      // delete cache
      const cacheKey = foundManga.is_draft
        ? `manga:unpublish:${mangaId}`
        : `manga:${mangaId}`;
      await this.cacheService.delete(cacheKey);
    }

    return { mangaCategories, changes };
  }

  // async deleteMangaCategory(
  //   category_id: number[],
  //   mangaId: number,
  // ): Promise<number> {
  //   const changes: { field: string; categoryId: any; categoryName: any }[] = [];
  //   const foundManga = await this.findMangaByIdCanPublishOrUnPublish(mangaId);

  //   const mangaCategory = Promise.all(
  //     category_id.map(async (id) => {
  //       const category = await this.categoryService.getCategoryById(id);
  //       changes.push({
  //         field: 'category_id',
  //         categoryId: id,
  //         categoryName: category.category_name,
  //       });
  //       return { category_id: id, manga_id: mangaId };
  //     }),
  //   );

  //   const result = await this.sequelize.transaction(async (t) => {
  //     const isDeleted = await this.mangaRepo.deleteMangaCategory(
  //       await Promise.resolve(mangaCategory),
  //       { transaction: t },
  //     );
  //     if (!isDeleted)
  //       throw new HttpException(
  //         'Can not delete manga category',
  //         HttpStatus.BAD_REQUEST,
  //       );

  //     await this.createHistoryOfUpdateManga(
  //       HistoryType.UpdateCategoryForManga,
  //       mangaId,
  //       `${foundManga.manga_title}-history`,
  //       { changes: changes },
  //     );

  //     return isDeleted;
  //   });

  //   // delete cache
  //   const cacheKey = foundManga.is_draft
  //     ? `manga:unpublish:${mangaId}`
  //     : `manga:${mangaId}`;
  //   await this.cacheService.delete(cacheKey);

  //   return result;
  // }

  async publishMangaById(mangaId: number): Promise<number> {
    const foundManga = await this.findMangaById(mangaId, false, true);
    const folderName = `${foundManga.manga_title}-history`;

    const result = this.sequelize.transaction(async (t) => {
      const isPublishedManga = await this.mangaRepo.publishMangaById(mangaId, {
        transaction: t,
      });
      if (!isPublishedManga)
        throw new HttpException(
          'Can not publish manga',
          HttpStatus.BAD_REQUEST,
        );

      await this.createHistoryOfUpdateManga(
        HistoryType.PublishManga,
        mangaId,
        folderName,
        { changes: [] },
      );
      // delete cache
      const cacheKey = `manga:unpublish:${mangaId}`;
      await this.cacheService.delete(cacheKey);

      return isPublishedManga;
    });

    return result;
  }

  async unpublishMangaById(mangaId: number): Promise<number> {
    const foundManga = await this.findMangaById(mangaId, false, false);
    const folderName = `${foundManga.manga_title}-history`;

    const result = this.sequelize.transaction(async (t) => {
      const isPublishedManga = await this.mangaRepo.unpublishMangaById(
        mangaId,
        {
          transaction: t,
        },
      );
      if (!isPublishedManga)
        throw new HttpException(
          'Can not unpublish manga',
          HttpStatus.BAD_REQUEST,
        );

      await this.createHistoryOfUpdateManga(
        HistoryType.UnpublishManga,
        mangaId,
        folderName,
        { changes: [] },
      );
      // delete cache
      const cacheKey = `manga:${mangaId}`;
      await this.cacheService.delete(cacheKey);

      return isPublishedManga;
    });

    return result;
  }

  async findMangaById(
    id: number,
    is_deleted: boolean = false,
    is_draft: boolean = false,
  ): Promise<Manga> {
    const whereConditions: any = { manga_id: id, is_deleted, is_draft };
    const foundManga = await this.mangaRepo.findMangaById(whereConditions);
    if (!foundManga)
      throw new HttpException('Not found manga', HttpStatus.BAD_REQUEST);
    return foundManga;
  }

  async findMangaByIdCanPublishOrUnPublish(
    id: number,
    is_deleted: boolean = false,
  ): Promise<Manga> {
    const whereConditions: any = { manga_id: id, is_deleted };
    const foundManga = await this.mangaRepo.findMangaById(whereConditions);
    if (!foundManga)
      throw new HttpException('Not found manga', HttpStatus.BAD_REQUEST);
    return foundManga;
  }

  async searchManga(
    publish: boolean = false,
    paginateDto: PaginatedDto<MangaDto>,
    searchMangaDto: SearchMangaDto,
  ): Promise<PaginatedDto<MangaDto>> {
    const page = paginateDto.page;
    const limit = paginateDto.limit;
    const {
      keyword,
      manga_status,
      category_id,
      updatedAt,
      createdAt,
      manga_views,
      manga_number_of_followers,
    } = searchMangaDto;
    // Where condition array
    const whereConditions: any[] =
      publish == true
        ? [{ is_deleted: false, is_draft: false, is_published: true }]
        : [{ is_deleted: false, is_draft: true, is_published: false }];

    // Full-text search condition if keyword is provided
    if (keyword) {
      whereConditions.push(
        literal(
          `MATCH (manga_title, manga_description) AGAINST ('${keyword}*' IN BOOLEAN MODE)`,
        ),
      );
    }

    // Status filter if provided
    if (manga_status) {
      whereConditions.push({ manga_status });
    }

    // Sorting logic
    const order = [];
    if (updatedAt) order.push(['updatedAt', 'DESC']);
    if (createdAt) order.push(['createdAt', 'DESC']);
    if (manga_views) order.push(['manga_views', 'DESC']);
    if (manga_number_of_followers) {
      order.push(['manga_number_of_followers', 'DESC']);
    }

    const includeConditions = [];
    // check category is exists then add to include condition
    if (category_id) {
      await this.categoryService.getCategoryById(category_id);
      includeConditions.push({
        model: Category,
        as: 'categories',
        through: { attributes: [] },
        attributes: [],
        required: !!category_id,
        where: category_id ? { category_id } : undefined,
      });
    }

    const { data, pagination } = await this.mangaRepo.searchManga(
      page,
      limit,
      whereConditions,
      order,
      includeConditions,
      { raw: true },
    );
    paginateDto = PaginateUtil.setPaginateDto(paginateDto, data, pagination);
    return paginateDto;
  }

  async getAllUnpublishManga(
    paginateDto: PaginatedDto<MangaDto>,
  ): Promise<PaginatedDto<MangaDto>> {
    const page = paginateDto.page;
    const limit = paginateDto.limit;
    const { data, pagination } =
      await this.mangaRepo.getAllUnPublishMangaPaginate(page, limit, {
        raw: true,
      });
    paginateDto = PaginateUtil.setPaginateDto(paginateDto, data, pagination);
    return paginateDto;
  }

  async getAllPublishManga(
    paginateDto: PaginatedDto<MangaDto>,
  ): Promise<PaginatedDto<MangaDto>> {
    const page = paginateDto.page;
    const limit = paginateDto.limit;
    const { data, pagination } =
      await this.mangaRepo.getAllPublishMangaPaginate(page, limit, {
        raw: true,
      });
    paginateDto = PaginateUtil.setPaginateDto(paginateDto, data, pagination);
    return paginateDto;
  }

  async getDetailsManga(mangaId: number): Promise<Manga> {
    const cacheKey = `manga:${mangaId}`;
    const cacheManga = await this.cacheService.get(cacheKey);
    if (cacheManga) {
      const manga = new Manga({ ...(cacheManga as object) });
      manga.setDataValue('categories', cacheManga['categories']);
      return manga.get({ plain: true });
    }

    const foundManga = await this.mangaRepo.getDetailsManga(mangaId, [
      { is_deleted: false, is_draft: false, is_published: true },
    ]);
    if (!foundManga)
      throw new HttpException('Not found manga', HttpStatus.BAD_REQUEST);

    await this.cacheService.set(
      cacheKey,
      foundManga.get({ plain: true }),
      '1d',
    );
    return foundManga.get({ plain: true });
  }

  async getDetailsUnpublishManga(mangaId: number): Promise<Manga> {
    const cacheKey = `manga:unpublish:${mangaId}`;
    const cacheManga = await this.cacheService.get(cacheKey);
    if (cacheManga) {
      const manga = new Manga({ ...(cacheManga as object) });
      manga.setDataValue('categories', cacheManga['categories']);
      return manga.get({ plain: true });
    }

    const foundManga = await this.mangaRepo.getDetailsManga(mangaId, [
      { is_deleted: false, is_draft: true, is_published: false },
    ]);
    if (!foundManga)
      throw new HttpException('Not found manga', HttpStatus.BAD_REQUEST);
    await this.cacheService.set(
      cacheKey,
      foundManga.get({ plain: true }),
      '1d',
    );
    return foundManga.get({ plain: true });
  }

  async ratingManga(mangaId: number, rating: number): Promise<number> {
    const foundManga = await this.findMangaById(mangaId);
    foundManga.manga_ratings_count += 1;
    foundManga.manga_total_star_rating += rating;
    const isUpdatedManga = await this.mangaRepo.updateManga(foundManga);
    if (!isUpdatedManga)
      throw new HttpException('Can not update Manga', HttpStatus.BAD_REQUEST);
    return isUpdatedManga;
  }

  async getNameMangaById(
    mangaId: number,
    conditions: {
      isDeleted?: boolean;
      isDraft?: boolean; //draft is unpublish
      canPublishOrUnpublish?: boolean; //unpublish is draft
    } = { isDeleted: false, isDraft: false, canPublishOrUnpublish: false },
  ): Promise<string> {
    const { canPublishOrUnpublish, isDeleted, isDraft } = conditions;
    let foundManga: Manga;
    if (!canPublishOrUnpublish) {
      foundManga = await this.findMangaById(mangaId, isDeleted, isDraft);
    } else {
      foundManga = await this.findMangaByIdCanPublishOrUnPublish(
        mangaId,
        conditions.isDeleted,
      );
    }
    return foundManga.manga_title;
  }

  async deleteManga(mangaId: number): Promise<number> {
    const foundManga = await this.findMangaById(mangaId, false, true); //make sure manga is draft before delete
    const folderName = `${foundManga.manga_title}-history`;

    // delete manga
    const result = await this.sequelize.transaction(async (t) => {
      const isDeleted = await this.mangaRepo.deleteMangaById(mangaId, {
        transaction: t,
      });
      if (!isDeleted)
        throw new HttpException('Can not delete Manga', HttpStatus.BAD_REQUEST);

      await this.createHistoryOfUpdateManga(
        HistoryType.DeleteManga,
        mangaId,
        folderName,
        { changes: [] },
      );

      // delete cache
      const cacheKey = foundManga.is_draft
        ? `manga:unpublish:${mangaId}`
        : `manga:${mangaId}`;
      await this.cacheService.delete(cacheKey);

      return isDeleted;
    });
    return result;
  }

  async createHistoryOfUpdateManga(
    type: HistoryType,
    mangaId: number,
    folderName: string,
    data: { changes: object[] } = {
      changes: [],
    },
  ): Promise<ContractTransaction> {
    const { changes } = data;

    // create and upload history file to Pinata
    const { cid } =
      await this.web3Service.getDataLatestBlockOfMangaUpdateByMangaId(mangaId);
    const dataOfLatestVersion = await this.pinataService.getFileByCid(cid);

    const { jsonBufferHistory, newVersion } =
      CommonUtil.createDataHistoryUpdateManga(type, cid, {
        dataToUpdate: changes,
        dataOfLatestVersion: dataOfLatestVersion,
      });

    const uploadJson = await this.pinataService.uploadFile(
      jsonBufferHistory,
      `${folderName}-v${newVersion}`,
      folderName,
    );

    // call smart contract to create a transaction in blockchain
    const tx = await this.web3Service
      .updateManga(mangaId, uploadJson['IpfsHash'])
      .catch(async (err) => {
        await this.pinataService.deleteFilesByCid([uploadJson['IpfsHash']]);
        throw new HttpException(
          'Something wrong when create manga',
          HttpStatus.BAD_REQUEST,
        );
      });
    return tx;
  }

  async saveChapterUserBeingRead({
    mangaId,
    chapNumber,
    userId,
  }: {
    mangaId: number;
    chapNumber: number;
    userId: number;
  }) {
    return this.mangaRepo.saveChapterUserBeingRead({
      mangaId,
      chapNumber,
      userId,
    });
  }

  async deleteChapterUserBeingRead({
    mangaId,
    userId,
  }: {
    mangaId: number;
    userId: number;
  }): Promise<number> {
    return this.mangaRepo.deleteChapterUserBeingRead({
      mangaId,
      userId,
    });
  }

  async increaseViewOfManga(mangaId: number): Promise<number> {
    await this.findMangaById(mangaId);

    const isUpdated = await this.mangaRepo.increaseViewOfManga(mangaId, {
      options: { raw: true },
    });

    if (!isUpdated)
      throw new HttpException(
        'Can not increase view of manga',
        HttpStatus.BAD_REQUEST,
      );
    return isUpdated;
  }
}
