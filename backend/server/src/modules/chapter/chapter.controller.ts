import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ChapterService } from './chapter.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { SwaggerApiOperation } from '@common/constants';
import { ResponseMessage } from '@common/decorators/response-message.decorator';
import { AuthorizeAction } from '@common/decorators/authorize-action.decorator';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { AtLeastOneFieldPipe } from '@common/pipes/at-least-one-field.pipe';
import { GuestRole } from '@common/decorators/roles.decorator';
import { PinataService } from 'src/shared/pinata/pinata.service';
import { FilesValidationPipe } from '@common/pipes/files-validation.pipe';
import { IMAGE_TYPES } from '@common/constants/file-type.constant';
import { DeleteChapterContentDto } from './dto/delete-chapter-content.dto';

@ApiBearerAuth()
@Controller('chapter')
export class ChapterController {
  constructor(
    private readonly chapterService: ChapterService,
    private readonly pinataService: PinataService,
  ) {}

  @ApiConsumes('application/json')
  @ApiOperation({
    summary: 'Add chapter by admin',
    description: `
  - **${SwaggerApiOperation.NEED_AUTH}**
  - Admin can create new chapter to manga
    `,
  })
  @Post(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Manga id',
  })
  @ApiBody({
    description: 'Add chapter',
    type: CreateChapterDto,
  })
  @ResponseMessage('Chapter added successful')
  @AuthorizeAction({ action: 'createAny', resource: 'Chapters' })
  async createChapterForManga(
    @Req() req: Request,
    @Body() createChapterDto: CreateChapterDto,
    @Param('id') mangaId: number,
  ) {
    const data = await this.chapterService.createChapterForManga(
      createChapterDto,
      mangaId,
    );
    return {
      metadata: req['permission'].filter(data),
    };
  }

  @ApiOperation({
    summary: 'Update chapter by admin',
    description: `
  - **${SwaggerApiOperation.NEED_AUTH}**
  - Admin can update chapter
    `,
  })
  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Chapter id',
  })
  @ApiBody({
    description: 'Update chapter',
    type: UpdateChapterDto,
  })
  @UseInterceptors(FilesInterceptor('chap_content'))
  @ResponseMessage('Chapter updated successful')
  @AuthorizeAction({ action: 'updateAny', resource: 'Chapters' })
  async updateChapter(
    @Req() req: Request,
    @Body(new AtLeastOneFieldPipe({ removeAllEmptyField: true }))
    updateChapterDto: UpdateChapterDto,
    @UploadedFiles(
      new FilesValidationPipe({ isRequired: false }, 5, IMAGE_TYPES),
    )
    files: Express.Multer.File[],
    @Param('id') chapterId: number,
  ) {
    const result = await this.chapterService.updateChapterForManga(
      updateChapterDto,
      chapterId,
      files,
    );
    return {
      metadata: result,
    };
  }

  @ApiOperation({
    summary: 'Get all chapters of manga',
    description: `
  - **${SwaggerApiOperation.NOT_NEED_AUTH}**
  - Admin can See more information.
    `,
  })
  @Get(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Manga id',
  })
  @ResponseMessage('Get all Chapters of manga successful')
  @AuthorizeAction({ action: 'readAny', resource: 'Chapters' })
  @GuestRole(true)
  async getAllChaptersByMangaId(
    @Req() req: Request,
    @Param('id') mangaId: number,
  ) {
    const role = req['permission']['_']['role'];
    const data = await this.chapterService.getAllChaptersByMangaId(
      mangaId,
      role,
    );
    return {
      metadata: req['permission'].filter(data),
    };
  }

  @ApiOperation({
    summary: 'See details chapters',
    description: `
  - **${SwaggerApiOperation.NOT_NEED_AUTH}**
  - Admin can See more information.
    `,
  })
  @Get('/details/:chapterId/manga/:mangaId')
  @ApiParam({
    name: 'mangaId',
    type: Number,
    description: 'Manga id',
  })
  @ApiParam({
    name: 'chapterId',
    type: Number,
    description: 'Chapter id',
  })
  @ResponseMessage('Get details chapter of manga successful')
  @AuthorizeAction({ action: 'readAny', resource: 'Chapters' })
  @GuestRole(true)
  async getDetailsOfChapter(
    @Req() req: Request,
    @Param('mangaId') mangaId: number,
    @Param('chapterId') chapterId: number,
  ) {
    const userId = req['user']?.['sub'] ?? null;
    const role = req['permission']['_']['role'];
    const data = await this.chapterService.getDetailsOfChapterByChapterId(
      mangaId,
      chapterId,
      userId,
      role,
    );
    return {
      metadata: req['permission'].filter(data),
    };
  }

  @ApiOperation({
    summary: 'Delete chapter',
    description: `
  - **${SwaggerApiOperation.NOT_NEED_AUTH}**
    `,
  })
  @Delete('/:id')
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Chapter id',
  })
  @ResponseMessage('Delete chapter successful')
  @AuthorizeAction({ action: 'deleteAny', resource: 'Chapters' })
  async deleteChapter(@Req() req: Request, @Param('id') chapId: number) {
    const data = await this.chapterService.deleteChapter(chapId);
    return {
      metadata: data,
    };
  }

  @ApiOperation({
    summary: 'Delete image in chapter content by admin',
    description: `
  - **${SwaggerApiOperation.NEED_AUTH}**
  - Admin can delete image in chapter content
    `,
  })
  @Delete('/:id/content')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Chapter id',
  })
  @ApiBody({
    description: 'Delete image in chapter content',
    type: DeleteChapterContentDto,
  })
  @ResponseMessage('Delete image in chapter content successful')
  @AuthorizeAction({ action: 'deleteAny', resource: 'Chapters' })
  async deleteImageInChapterContent(
    @Req() req: Request,
    @Body(new AtLeastOneFieldPipe({ removeAllEmptyField: true }))
    deleteChapterContentDto: DeleteChapterContentDto,
    @Param('id') chapterId: number,
  ) {
    return {
      metadata: await this.chapterService.deleteImageInChapterContent(
        chapterId,
        deleteChapterContentDto,
      ),
    };
  }

  // @ApiOperation({
  //   summary: 'Test Folder upload by admin',
  //   description: `
  // - **${SwaggerApiOperation.NEED_AUTH}**
  //   `,
  // })
  // @Post('test-folder-upload/:id')
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   description: 'Add chapter',
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       chap_content: {
  //         type: 'array',
  //         items: { type: 'string', format: 'binary' },
  //       },
  //     },
  //   },
  // })
  // @ApiParam({
  //   name: 'id',
  //   type: Number,
  //   description: 'Chapter id',
  // })
  // @UseInterceptors(FilesInterceptor('chap_content'))
  // @ResponseMessage('Chapter updated successful')
  // @AuthorizeAction({ action: 'updateAny', resource: 'Chapters' })
  // async testFolderUpload(
  //   @Req() req: Request,
  //   @UploadedFiles(
  //     new FilesValidationPipe({ isRequired: false }, 5, IMAGE_TYPES),
  //   )
  //   files: Express.Multer.File[],
  //   @Param('id') chapterId: number,
  // ) {
  //   const result = await this.chapterService.testFolderUpload(files);
  //   return {
  //     metadata: result,
  //   };
  // }

  @ApiOperation({
    summary: 'Increase views of chapter',
    description: `
    `,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Chapter id',
  })
  @Patch('/views/:id')
  @ResponseMessage('Increase views of chapter successful')
  async increaseViewOfChapter(@Param('id', ParseIntPipe) chapterId: number) {
    return {
      metadata: await this.chapterService.increaseViewOfChapter(chapterId),
    };
  }
}
