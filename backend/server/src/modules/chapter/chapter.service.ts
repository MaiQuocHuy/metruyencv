import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ChapterRepo } from './chapter.repo';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { MangaService } from '@modules/manga/manga.service';
import { Chapter } from './models/chapter.model';
import Util from '@common/services/util.service';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { PinataService } from 'src/shared/pinata/pinata.service';
import { HistoryType } from 'src/shared/utils/enums.util';
import { ContractTransaction } from 'ethers';
import { Web3Service } from 'src/shared/web3/web3.service';
import CommonUtil from 'src/shared/utils/common.util';
import { Sequelize } from 'sequelize-typescript';
import { CacheService } from 'src/shared/cache/cache.service';
import { UserService } from '@modules/user/user.service';
import { RoleSlug } from '@common/constants';
import { Manga } from '@modules/manga/models/manga.model';
import { DeleteChapterContentDto } from './dto/delete-chapter-content.dto';

@Injectable()
export class ChapterService {
  constructor(
    private readonly chapterRepo: ChapterRepo,
    private readonly mangaService: MangaService,
    private readonly pinataService: PinataService,
    private util: Util,
    private web3Service: Web3Service,
    private sequelize: Sequelize,
    private cacheService: CacheService,
  ) {}

  async createChapterForManga(
    createChapterDto: CreateChapterDto,
    mangaId: number,
  ): Promise<Chapter> {
    const foundManga =
      await this.mangaService.findMangaByIdCanPublishOrUnPublish(mangaId);

    const listCid = createChapterDto.list_cid;
    const nameManga = foundManga.manga_title;
    const folderName = `${nameManga}/${createChapterDto.chap_number}`;

    const secureUrls = listCid.map((result, index) => ({
      page: index,
      image: `ipfs.io/ipfs/${result}`,
    }));

    const jsonBufferUrls = Buffer.from(JSON.stringify(secureUrls));
    const uploadJsonUrls = await this.pinataService.uploadFile(
      jsonBufferUrls,
      `${new Date().toISOString()}-${createChapterDto.chap_number}-content`,
      folderName,
    );

    const result = this.sequelize.transaction(async (t) => {
      const chapterId = this.util.generateIdByTime();
      const updateObj = {
        chap_id: chapterId,
        chap_manga_id: mangaId,
        chap_title: createChapterDto.chap_title,
        chap_number: createChapterDto.chap_number,
        chap_content: uploadJsonUrls['IpfsHash'],
      };
      const newChapter = await this.chapterRepo.createChapter(
        new Chapter(updateObj),
        { transaction: t },
      );

      const folderHistoryName = `${nameManga}-history`;
      await this.createHistoryOfUpdateChapter(
        HistoryType.CreateChapter,
        mangaId,
        folderHistoryName,
        {
          changes: [updateObj],
        },
      );
      // delete cache
      const cacheKey = foundManga.is_draft
        ? `list_chapter_unpublish:${mangaId}`
        : `list_chapter:${mangaId}`;
      await this.cacheService.delete(cacheKey);

      return newChapter.get({ plain: true });
    });
    return result;
  }

  async updateChapterForManga(
    updateChapterDto: UpdateChapterDto,
    chapId: number,
    files: Express.Multer.File[] = [],
  ) {
    // Check chapter is exists
    let foundChapter = await this.findChapterById(chapId);
    // Get nameManga and make sure manga is not deleted
    const foundManga =
      await this.mangaService.findMangaByIdCanPublishOrUnPublish(
        foundChapter.chap_manga_id,
      );
    const nameManga = foundManga.manga_title;
    const mangaId = foundManga.manga_id;

    // Replace data of dto to old value
    const { changes, updatedObject } = this.util.replaceDataObjectByKey({
      objReplace: updateChapterDto,
      objWillBeReplace: foundChapter,
    });
    foundChapter = updatedObject;

    const updateBaseInfoOfChapter = changes.length == 0 ? true : false;

    if (files.length != 0 && updateChapterDto.chap_img_pages.length != 0) {
      const chapterContent = await this.pinataService.getFileByCid(
        foundChapter.chap_content,
      );
      chapterContent['data'] = chapterContent['data'] as Array<any>;

      const folderName = `${nameManga}/${foundChapter.chap_number}`;

      const uploadResults = await this.pinataService.uploadManyFiles(
        files,
        folderName,
        updateChapterDto.chap_img_pages,
      );
      const secureUrls = uploadResults.map((result, index) => ({
        page: updateChapterDto.chap_img_pages[index],
        image: `ipfs.io/ipfs/${result['IpfsHash']}`,
      }));

      updateChapterDto.chap_img_pages.forEach((value, index) => {
        if (chapterContent['data'][value] == undefined) {
          chapterContent['data'].push(secureUrls[index]);
        } else {
          chapterContent['data'][value] = secureUrls[index];
        }
      });

      const jsonBufferUrls = Buffer.from(
        JSON.stringify(chapterContent['data']),
      );
      const uploadJsonUrls = await this.pinataService.uploadFile(
        jsonBufferUrls,
        // `${nameManga}-${foundChapter.chap_number}`,
        `${new Date().toISOString()}-${foundChapter.chap_number}-content`,
        folderName,
      );

      changes.push({
        field: 'chap_content',
        oldValue: foundChapter.chap_content,
        newValue: uploadJsonUrls['IpfsHash'],
      });
      foundChapter.chap_content = uploadJsonUrls['IpfsHash'];
    }

    const result = this.sequelize.transaction(async (t) => {
      const isUpdated = await this.chapterRepo.updateChapter(foundChapter, {
        transaction: t,
      });
      if (!isUpdated)
        throw new HttpException(
          'Can not update Chapter',
          HttpStatus.BAD_REQUEST,
        );

      const folderHistoryName = `${nameManga}-history`;
      await this.createHistoryOfUpdateChapter(
        HistoryType.UpdateChapter,
        foundChapter.chap_manga_id,
        folderHistoryName,
        {
          changes: changes,
        },
      );

      // delete cache
      const cacheKeyChapterDetails = foundManga.is_draft
        ? `chapter_details_unpublish:${mangaId}:chapters:${chapId}`
        : `chapter_details:${mangaId}:chapters:${chapId}`;
      await this.cacheService.delete(cacheKeyChapterDetails);

      // if we update base info of chapter like title, number then delete cache of list chapters
      if (!updateBaseInfoOfChapter) {
        const cacheKeyListOfChapter = foundManga.is_draft
          ? `list_chapter_unpublish:${mangaId}`
          : `list_chapter:${mangaId}`;
        await this.cacheService.delete(cacheKeyListOfChapter);
      }

      return isUpdated;
    });
    return result;
  }

  async findChapterById(
    chapId: number,
    {
      isDeleted = false,
      options = {},
    }: { isDeleted?: boolean; options?: object } = {},
  ): Promise<Chapter> {
    const foundChapter = await this.chapterRepo.findChapterById(chapId, {
      isDeleted,
      options,
    });
    if (!foundChapter)
      throw new HttpException('Not Found Chapter', HttpStatus.NOT_FOUND);
    return foundChapter;
  }

  async getAllChaptersByMangaId(
    mangaId: number,
    role: string,
  ): Promise<Chapter[]> {
    let foundManga: Manga;
    if (role == RoleSlug.ADMIN) {
      foundManga =
        await this.mangaService.findMangaByIdCanPublishOrUnPublish(mangaId);
    } else {
      foundManga = await this.mangaService.findMangaById(mangaId);
    }

    const cacheKey = foundManga.is_draft
      ? `list_chapter_unpublish:${mangaId}`
      : `list_chapter:${mangaId}`;
    const cacheListChapters = await this.cacheService.get(cacheKey);
    if (cacheListChapters) {
      const listChapters = (cacheListChapters as Chapter[]).map(
        (value, index) => {
          const chapter = new Chapter({ ...(value as Chapter) });
          return chapter.get({ plain: true });
        },
      );
      return listChapters;
    }

    const listChapters = await this.chapterRepo.getAllChaptersByMangaId(
      mangaId,
      {
        options: {
          raw: true,
          attributes: { exclude: ['chap_content'] },
        },
      },
    );
    await this.cacheService.set(cacheKey, listChapters, '1d');

    return listChapters;
  }

  async getNumberOfChapters(mangaId: number): Promise<number> {
    return await this.chapterRepo.getNumberOfChapters(mangaId);
  }

  async getDetailsOfChapterByChapterId(
    mangaId: number,
    chapterId: number,
    userId: number,
    role: string,
  ): Promise<Chapter> {
    let foundManga: Manga;
    if (role == RoleSlug.ADMIN) {
      foundManga =
        await this.mangaService.findMangaByIdCanPublishOrUnPublish(mangaId);
    } else {
      foundManga = await this.mangaService.findMangaById(mangaId);
    }

    const cacheKey = foundManga.is_draft
      ? `chapter_details_unpublish:${mangaId}:chapters:${chapterId}`
      : `chapter_details:${mangaId}:chapters:${chapterId}`;
    const cacheChapter = await this.cacheService.get(cacheKey);
    if (cacheChapter) {
      const chapter = new Chapter({ ...(cacheChapter as object) });
      if (userId && role == RoleSlug.USER) {
        // delete and save Chapter user being read
        await this.mangaService.deleteChapterUserBeingRead({ mangaId, userId });
        await this.mangaService.saveChapterUserBeingRead({
          mangaId,
          chapNumber: chapter.chap_number,
          userId,
        });
      }

      return chapter.get({ plain: true });
    }

    const foundChapter = await this.chapterRepo.getDetailsOfChapterByChapterId(
      chapterId,
      {
        options: { raw: true },
      },
    );
    if (!foundChapter)
      throw new HttpException('Not Found Chapter', HttpStatus.NOT_FOUND);

    await this.cacheService.set(cacheKey, foundChapter, '1d');

    if (userId && role == RoleSlug.USER) {
      // delete and save Chapter user being read
      await this.mangaService.deleteChapterUserBeingRead({ mangaId, userId });
      await this.mangaService.saveChapterUserBeingRead({
        mangaId,
        chapNumber: foundChapter.chap_number,
        userId,
      });
    }

    return foundChapter;
  }

  async increaseViewOfChapter(chapterId: number): Promise<number> {
    const foundChapter = await this.findChapterById(chapterId);
    await this.mangaService.findMangaById(foundChapter.chap_manga_id);

    const isUpdated = await this.chapterRepo.increaseViewOfChapter(chapterId, {
      raw: true,
    });

    if (!isUpdated)
      throw new HttpException(
        'Can not increase view of chapter',
        HttpStatus.BAD_REQUEST,
      );
    return isUpdated;
  }

  async deleteChapter(chapId: number): Promise<number> {
    // Check chapter is exists
    const foundChapter = await this.findChapterById(chapId);

    // Check manga is not deleted then get nameManga
    const foundManga =
      await this.mangaService.findMangaByIdCanPublishOrUnPublish(
        foundChapter.chap_manga_id,
      );
    const nameManga = foundManga.manga_title;
    const isDraft = foundManga.is_draft;
    const mangaId = foundManga.manga_id;

    const result = this.sequelize.transaction(async (t) => {
      const isDeleted = await this.chapterRepo.deleteChapterById(chapId, {
        transaction: t,
      });
      if (!isDeleted)
        throw new HttpException(
          'Can not delete Chapter',
          HttpStatus.BAD_REQUEST,
        );

      const folderHistoryName = `${nameManga}-history`;
      await this.createHistoryOfUpdateChapter(
        HistoryType.DeleteChapter,
        foundChapter.chap_manga_id,
        folderHistoryName,
        {
          changes: [],
        },
      );

      const cacheKeyListOfChapter = isDraft
        ? `list_chapter_unpublish:${mangaId}`
        : `list_chapter:${mangaId}`;
      await this.cacheService.delete(cacheKeyListOfChapter);

      const cacheKeyChapterDetails = isDraft
        ? `chapter_details_unpublish:${mangaId}:chapters:${chapId}`
        : `chapter_details:${mangaId}:chapters:${chapId}`;
      await this.cacheService.delete(cacheKeyChapterDetails);

      return isDeleted;
    });
    return result;
  }

  async createHistoryOfUpdateChapter(
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

  async deleteImageInChapterContent(
    chapId: number,
    deleteChapterContentDto: DeleteChapterContentDto,
  ): Promise<number> {
    // Check chapter is exists
    const foundChapter = await this.findChapterById(chapId);
    // Get nameManga and make sure manga is not deleted
    const foundManga =
      await this.mangaService.findMangaByIdCanPublishOrUnPublish(
        foundChapter.chap_manga_id,
      );
    const nameManga = foundManga.manga_title;
    const mangaId = foundManga.manga_id;

    const chapterContent = await this.pinataService.getFileByCid(
      foundChapter.chap_content,
    );

    const chapterContentFiltered = this.deleteImageInContentObjectByCid(
      chapterContent['data'],
      deleteChapterContentDto.chap_content_cid,
    );

    if (chapterContentFiltered.length == 0)
      throw new HttpException('Not thing to delete', HttpStatus.BAD_REQUEST);

    const folderName = `${nameManga}/${foundChapter.chap_number}`;
    const jsonBufferUrls = Buffer.from(JSON.stringify(chapterContentFiltered));
    const uploadJsonUrls = await this.pinataService.uploadFile(
      jsonBufferUrls,
      `${new Date().toISOString()}-${foundChapter.chap_number}-content`,
      folderName,
    );

    const changes: { field: string; oldValue: any; newValue: any }[] = [];
    changes.push({
      field: 'chap_content',
      oldValue: foundChapter.chap_content,
      newValue: uploadJsonUrls['IpfsHash'],
    });
    foundChapter.chap_content = uploadJsonUrls['IpfsHash'];

    const result = this.sequelize.transaction(async (t) => {
      const isUpdated = await this.chapterRepo.updateChapter(foundChapter, {
        transaction: t,
      });
      if (!isUpdated)
        throw new HttpException(
          'Can not update Chapter',
          HttpStatus.BAD_REQUEST,
        );

      const folderHistoryName = `${nameManga}-history`;
      await this.createHistoryOfUpdateChapter(
        HistoryType.DeleteImageInChapterContent,
        foundChapter.chap_manga_id,
        folderHistoryName,
        {
          changes: changes,
        },
      );

      // delete cache
      const cacheKeyChapterDetails = foundManga.is_draft
        ? `chapter_details_unpublish:${mangaId}:chapters:${chapId}`
        : `chapter_details:${mangaId}:chapters:${chapId}`;
      await this.cacheService.delete(cacheKeyChapterDetails);

      return isUpdated;
    });
    return result;
  }

  deleteImageInContentObjectByCid(
    contentObj: string[],
    listCidBeDeleted: string[],
  ) {
    if (!Array.isArray(contentObj) || contentObj.length === 0) return [];

    let decreasePageNumber = 0;
    // Extract CIDs from IPFS URLs
    const contentObjFiltered = contentObj.filter((content) => {
      const url = content['image'];
      const page = content['page'];
      // Check if the URL contains 'ipfs/' and extract the CID part
      const match = url.match(/ipfs\/([a-zA-Z0-9]+)/);
      if (listCidBeDeleted.includes(match[1])) {
        decreasePageNumber++;
        return;
      }
      content['page'] = page - decreasePageNumber;
      return content;
    });

    return contentObjFiltered;
  }

  async testFolderUpload(files: Express.Multer.File[] = []) {
    // const groupName = `test-folder-upload`;
    // // const groupName = '';
    // const filesName = ['abc', 'def', 'ghi', 'klm', 'nop'];

    // const uploadResults = await this.pinataService.folderUpload(
    //   files,
    //   groupName,
    //   filesName,
    //   'abcde',
    // );
    // const ipfsHash = uploadResults['IpfsHash'];
    // const folder = await this.pinataService.getFileByCid(ipfsHash);
    const response = await fetch(
      `https://ipfs.io/ipfs/bafybeigkhr2doeudsznsr47jpuwb4gjg2zc3ryj4eusjyn7sr4yv2rl7fa/`,
    );
    const data = await response.text();

    return this.extractCIDFromTextHtml(data);
  }
  extractCIDFromTextHtml(html: string): string[] {
    const cidRegex = /href="\/ipfs\/([a-zA-Z0-9]+)\?filename=/g;
    const matches = [];
    let match;

    while ((match = cidRegex.exec(html)) !== null) {
      matches.push(match[1]); // Extract CID
    }

    return matches;
  }
}
