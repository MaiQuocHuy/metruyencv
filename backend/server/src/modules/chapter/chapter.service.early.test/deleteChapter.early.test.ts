import { HttpException } from '@nestjs/common';
import { ChapterService } from '../chapter.service';

// Mock classes
class MockChapterRepo {
  public findChapterById = jest.fn();
  public deleteChapterById = jest.fn();
}

class MockMangaService {
  public getNameMangaById = jest.fn();
}

class MockPinataService {
  public getFileByCid = jest.fn();
  public uploadFile = jest.fn();
  public deleteFilesByCid = jest.fn();
}

class MockUtil {}

class MockWeb3Service {
  public getDataLatestBlockOfMangaUpdateByMangaId = jest.fn();
  public updateManga = jest.fn();
}

class MockSequelize {
  public transaction = jest.fn();
}

class MockCacheService {}

describe('ChapterService.deleteChapter() deleteChapter method', () => {
  let chapterService: ChapterService;
  let mockChapterRepo: MockChapterRepo;
  let mockMangaService: MockMangaService;
  let mockPinataService: MockPinataService;
  let mockUtil: MockUtil;
  let mockWeb3Service: MockWeb3Service;
  let mockSequelize: MockSequelize;
  let mockCacheService: MockCacheService;

  beforeEach(() => {
    mockChapterRepo = new MockChapterRepo() as any;
    mockMangaService = new MockMangaService() as any;
    mockPinataService = new MockPinataService() as any;
    mockUtil = new MockUtil() as any;
    mockWeb3Service = new MockWeb3Service() as any;
    mockSequelize = new MockSequelize() as any;
    mockCacheService = new MockCacheService() as any;

    chapterService = new ChapterService(
      mockChapterRepo as any,
      mockMangaService as any,
      mockPinataService as any,
      mockUtil as any,
      mockWeb3Service as any,
      mockSequelize as any,
      mockCacheService as any,
    );
  });

  // Happy path test
  it('should delete a chapter successfully', async () => {
    const chapId = 1;
    const foundChapter = { chap_manga_id: 1 };
    const nameManga = 'MangaName';

    jest
      .mocked(mockChapterRepo.findChapterById)
      .mockResolvedValue(foundChapter as any);
    jest
      .mocked(mockMangaService.getNameMangaById)
      .mockResolvedValue(nameManga as any);
    jest.mocked(mockChapterRepo.deleteChapterById).mockResolvedValue(1 as any);
    jest
      .mocked(mockSequelize.transaction)
      .mockImplementation(async (fn) => fn());

    const result = await chapterService.deleteChapter(chapId);

    expect(result).toBe(1);
    expect(mockChapterRepo.findChapterById).toHaveBeenCalledWith(chapId, {
      isDeleted: false,
      options: {},
    });
    expect(mockMangaService.getNameMangaById).toHaveBeenCalledWith(
      foundChapter.chap_manga_id,
      { canPublishOrUnpublish: true },
    );
    expect(mockChapterRepo.deleteChapterById).toHaveBeenCalledWith(chapId, {
      transaction: expect.anything(),
    });
  });

  // Edge case: Chapter not found
  it('should throw an error if the chapter is not found', async () => {
    const chapId = 1;

    jest.mocked(mockChapterRepo.findChapterById).mockResolvedValue(null as any);

    await expect(chapterService.deleteChapter(chapId)).rejects.toThrow(
      HttpException,
    );
    await expect(chapterService.deleteChapter(chapId)).rejects.toThrow(
      'Not Found Chapter',
    );
  });

  // Edge case: Unable to delete chapter
  it('should throw an error if unable to delete the chapter', async () => {
    const chapId = 1;
    const foundChapter = { chap_manga_id: 1 };
    const nameManga = 'MangaName';

    jest
      .mocked(mockChapterRepo.findChapterById)
      .mockResolvedValue(foundChapter as any);
    jest
      .mocked(mockMangaService.getNameMangaById)
      .mockResolvedValue(nameManga as any);
    jest.mocked(mockChapterRepo.deleteChapterById).mockResolvedValue(0 as any);
    jest
      .mocked(mockSequelize.transaction)
      .mockImplementation(async (fn) => fn());

    await expect(chapterService.deleteChapter(chapId)).rejects.toThrow(
      HttpException,
    );
    await expect(chapterService.deleteChapter(chapId)).rejects.toThrow(
      'Can not delete Chapter',
    );
  });
});
