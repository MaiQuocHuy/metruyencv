import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MangaService } from './manga.service';
import { CreateMangaDto } from './dto/create-manga.dto';
import { AuthGuard } from '@common/guards/auth.guard';
import { ResponseMessage } from '@common/decorators/response-message.decorator';
import { RolesGuard } from '@common/guards/roles.guard';
import { GuestRole, Roles } from '@common/decorators/roles.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { RoleSlug, SwaggerApiOperation } from '@common/constants';
import { MangaStatus, UpdateMangaDto } from './dto/update-manga.dto';
import { AtLeastOneFieldPipe } from '@common/pipes/at-least-one-field.pipe';
import Util from '@common/services/util.service';
import { UpdateMangaCategoryDto } from './dto/update-manga-category.dto';
import { ArchivedResourceAccess } from '@common/decorators/archived-resource.decorator';
import { PaginatedDto } from 'src/shared/dto/paginate.dto';
import { MangaDto } from './dto/manga.dto';
import { ApiPaginateQuery } from '@common/decorators/api-paginate-query.decorator';
import { SearchMangaDto } from './dto/search-manga.dto';
import { AuthorizeAction } from '@common/decorators/authorize-action.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadDto } from './dto/test.dto';
import { UserService } from '@modules/user/user.service';
import { FileValidationPipe } from '@common/pipes/file-validation.pipe';
import { IMAGE_TYPES } from '@common/constants/file-type.constant';
import { isEmpty } from 'lodash';

@ApiBearerAuth()
@ApiTags('Manga')
@Controller('manga')
export class MangaController {
  constructor(
    private readonly mangaService: MangaService,
    private userService: UserService,
  ) {}

  @ApiOperation({
    summary: 'Admin create Manga',
    description: `
  - **${SwaggerApiOperation.NEED_AUTH}**
  - Only **admin** can use this API.
      `,
  })
  @Post('')
  @UseInterceptors(FileInterceptor('manga_thumb'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create Manga',
    type: CreateMangaDto,
  })
  @ResponseMessage('Manga created successfully')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Roles({ action: 'createAny', resource: 'Manga' })
  async createManga(
    @Body() createMangaDto: CreateMangaDto,
    @UploadedFile(new FileValidationPipe(5, IMAGE_TYPES)) // 5MB
    file: Express.Multer.File,
  ) {
    return {
      metadata: await this.mangaService.createManga(createMangaDto, file),
    };
  }

  @ApiOperation({
    summary: 'Admin update Manga',
    description: `
  - **${SwaggerApiOperation.NEED_AUTH}**
  - Only **admin** can use this API.

  - \`manga_status\` has the following values: ${Util.getAllDataOfEnum(MangaStatus).join('\n')}

  - **All attributes in request body is an option**
      `,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Id of manga',
  })
  @Patch(':id')
  @UseInterceptors(FileInterceptor('manga_thumb'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update Manga',
    type: UpdateMangaDto,
  })
  @ResponseMessage('Manga updated successfully')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Roles({ action: 'updateAny', resource: 'Manga' })
  async updateManga(
    @Param('id', ParseIntPipe) id: number,
    // @Body()
    @Body(
      new AtLeastOneFieldPipe({
        removeAllEmptyField: true,
        acceptEmptyValue: true,
      }),
    )
    updateMangaDto: UpdateMangaDto, // need to check at least one value
    @UploadedFile(new FileValidationPipe(5, IMAGE_TYPES))
    file: Express.Multer.File,
  ) {
    // Kiểm tra nếu body rỗng & không có file nào thì báo lỗi
    if (isEmpty(updateMangaDto) && isEmpty(file)) {
      throw new BadRequestException(
        'At least one field or image must be provided.',
      );
    }
    return {
      metadata: await this.mangaService.updateManga(id, updateMangaDto, file),
    };
  }

  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({
    summary: 'Admin update Manga Category (remove or create)',
    description: `
  - **${SwaggerApiOperation.NEED_AUTH}**
  - Only **admin** can use this API.
  - Can add many categories.
      `,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Id of manga',
  })
  @ApiBody({
    description: 'Update Manga',
    type: UpdateMangaCategoryDto,
  })
  @Post('/manga-category/:id')
  @ResponseMessage('Add Manga Category successful')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Roles({ action: 'updateAny', resource: 'Manga' })
  async updateMangaCategory(
    @Req() req: Request,
    @Param('id') id: number,
    @Body(new AtLeastOneFieldPipe({ removeAllEmptyField: true }))
    updateMangaCategoryDto: UpdateMangaCategoryDto,
  ) {
    const { mangaCategories } = await this.mangaService.addMangaCategory(
      {
        listNewCategoryId: updateMangaCategoryDto.listNewCategoryId,
        listRemoveCategoryId: updateMangaCategoryDto.listRemoveCategoryId,
      },
      id,
    );
    return {
      metadata: mangaCategories,
    };
  }

  // @ApiOperation({
  //   summary: 'Admin delete Manga Category',
  //   description: `
  // - **${SwaggerApiOperation.NEED_AUTH}**
  // - Only **admin** can use this API.
  // - Can delete many categories.
  // - If have any error in process delete, it will rollback data
  //     `,
  // })
  // @ApiParam({
  //   name: 'id',
  //   type: Number,
  //   description: 'Id of manga',
  // })
  // @Delete('/manga-category/:id')
  // @ResponseMessage('Delete Manga Category successful')
  // @UseGuards(RolesGuard)
  // @UseGuards(AuthGuard)
  // @Roles({ action: 'deleteAny', resource: 'Manga' })
  // async deleteMangaCategory(
  //   @Param('id') id: number,
  //   @Body() updateMangaCategoryDto: UpdateMangaCategoryDto,
  // ) {
  //   return {
  //     metadata: await this.mangaService.deleteMangaCategory(
  //       updateMangaCategoryDto.listNewCategoryId,
  //       id,
  //     ),
  //   };
  // }

  @ApiOperation({
    summary: 'Admin publish Manga',
    description: `
  - **${SwaggerApiOperation.NEED_AUTH}**
  - Only **admin** can use this API.
      `,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Id of manga',
  })
  @Patch('/publish/:id')
  @ResponseMessage('Publish Manga successful')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Roles({ action: 'updateAny', resource: 'Manga' })
  async publishManga(@Param('id') id: number) {
    return {
      metadata: await this.mangaService.publishMangaById(id),
    };
  }

  @ApiOperation({
    summary: 'Admin unpublish Manga',
    description: `
  - **${SwaggerApiOperation.NEED_AUTH}**
  - Only **admin** can use this API.
      `,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Id of manga',
  })
  @Patch('/unpublish/:id')
  @ResponseMessage('Unpublish Manga successful')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Roles({ action: 'updateAny', resource: 'Manga' })
  async unpublishManga(@Param('id') id: number) {
    return {
      metadata: await this.mangaService.unpublishMangaById(id),
    };
  }

  @ApiOperation({
    summary: 'Search Manga',
    description: `
  - **${SwaggerApiOperation.NOT_NEED_AUTH}**
  - Everyone can use this route
  - **Just only choose one sort field**:
      'updatedAt',
      'createdAt',
      'manga_views',
      'manga_number_of_followers',
  - **Admin** can see more information
      `,
  })
  @Get('/search')
  @ApiQuery({
    name: 'publish',
    required: true,
    description: 'Get manga publish or unpublish',
    type: Boolean,
    example: true,
  })
  @ResponseMessage('Search manga successful')
  @AuthorizeAction({ action: 'readAny', resource: 'Manga' })
  @ApiPaginateQuery()
  @GuestRole(true)
  async searchManga(
    @Req() req: Request,
    @Query('publish', ParseBoolPipe) publish: boolean,
    @Query() paginateDto: PaginatedDto<MangaDto>,
    @Query() searchMangaDto: SearchMangaDto,
  ) {
    const userId = req['user']?.['sub'] ?? null;
    if (userId) {
      const roleSlug = await this.userService.getRoleSlugOfUser(
        req['user']['sub'],
      );
      if (!publish && !(roleSlug == RoleSlug.ADMIN)) {
        throw new HttpException(
          'You do not have permission to access this resource.',
          HttpStatus.UNAUTHORIZED,
        );
      }
    }

    const data: PaginatedDto<MangaDto> = await this.mangaService.searchManga(
      publish,
      paginateDto,
      searchMangaDto,
    );
    const { results, ...pagination } = data;
    return {
      metadata: req['permission'].filter(results),
      option: { pagination },
    };
  }

  @ApiOperation({
    summary: 'Get all unpublish manga',
    description: `
  - **${SwaggerApiOperation.NEED_AUTH}**
  - Only **admin** can see this API
      `,
  })
  @Get('/unpublish')
  @ResponseMessage('Get all unpublish manga successful')
  @Roles({ action: 'readAny', resource: 'Manga' })
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @ArchivedResourceAccess(true)
  @ApiPaginateQuery()
  async getAllUnpublishManga(
    @Req() req: Request,
    @Query() paginateDto: PaginatedDto<MangaDto>,
  ) {
    const data: PaginatedDto<MangaDto> =
      await this.mangaService.getAllUnpublishManga(paginateDto);
    const { results, ...pagination } = data;
    return {
      metadata: req['permission'].filter(results),
      option: {
        pagination,
      },
    };
  }

  @ApiOperation({
    summary: 'Get all publish manga',
    description: `
  - **${SwaggerApiOperation.NOT_NEED_AUTH}**
  - Everyone can use this route
  - Order by updated date
  - **Admin** can see more information
      `,
  })
  @Get('/publish')
  @ResponseMessage('Get all publish manga successful')
  @Roles({ action: 'readAny', resource: 'Manga' })
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @GuestRole(true)
  @ApiPaginateQuery()
  async getAllPublishManga(
    @Req() req: Request,
    @Query() paginateDto: PaginatedDto<MangaDto>,
  ) {
    const data: PaginatedDto<MangaDto> =
      await this.mangaService.getAllPublishManga(paginateDto);
    const { results, ...pagination } = data;
    return {
      metadata: req['permission'].filter(results),
      option: {
        pagination,
      },
    };
  }

  @ApiOperation({
    summary: 'View Details Manga',
    description: `
  - **${SwaggerApiOperation.NOT_NEED_AUTH}**
  - Everyone can use this route
  - **Admin** can see more information
  - This route just use to find manga **not deleted, not draft, and published**
      `,
  })
  @Get('/details/:id')
  @ResponseMessage('Get details manga successful')
  @AuthorizeAction({ action: 'readAny', resource: 'Manga' })
  @GuestRole(true)
  async getDetailsManga(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const data = await this.mangaService.getDetailsManga(id);
    return {
      metadata: req['permission'].filter(data),
    };
  }

  @ApiOperation({
    summary: 'View Details Unpublish (draft) Manga',
    description: `
  - **${SwaggerApiOperation.NOT_NEED_AUTH}**
  - This route just use to find manga **not deleted, not published and draft**
      `,
  })
  @Get('/details/unpublish/:id')
  @ResponseMessage('Get details unpublish manga successful')
  @AuthorizeAction({ action: 'readAny', resource: 'Manga' })
  @ArchivedResourceAccess(true)
  async getDetailsUnpublishManga(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const data = await this.mangaService.getDetailsUnpublishManga(id);
    return {
      metadata: req['permission'].filter(data),
    };
  }

  @ApiOperation({
    summary: 'User rating for Manga',
    description: `
  - **${SwaggerApiOperation.NEED_AUTH}**
  - Just user have account can use this API
      `,
  })
  @Patch('/rating/:id')
  @ResponseMessage('Rating manga successful')
  @AuthorizeAction({ action: 'readAny', resource: 'Manga' })
  @GuestRole(true)
  async ratingForManga(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Query('rating', ParseIntPipe) rating: number,
  ) {
    const data = await this.mangaService.ratingManga(id, rating);
    return {
      metadata: data,
    };
  }

  @ApiOperation({
    summary: 'Admin delete Manga',
    description: `
  - **${SwaggerApiOperation.NEED_AUTH}**
  - Only **admin** can use this API.
  - If you want to delete manga, you need to change manga to draft first
      `,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Id of manga',
  })
  @Delete('/:id')
  @ResponseMessage('Delete Manga successful')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Roles({ action: 'deleteAny', resource: 'Manga' })
  async deleteManga(@Param('id') id: number) {
    return {
      metadata: await this.mangaService.deleteManga(id),
    };
  }

  @ApiOperation({
    summary: 'Get CIDStorage contract address',
  })
  @Get('/contract-address/cid-storage')
  @AuthorizeAction({ action: 'readAny', resource: 'Web3' })
  @ResponseMessage('Get CIDStorage contract address successful')
  async getCidStorageContractAddress() {
    return {
      metadata: await this.mangaService.getCidStorageContractAddress(),
    };
  }

  @ApiOperation({
    summary: 'Increase view of manga',
    description: `
      `,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Id of manga',
  })
  @Patch('/views/:id')
  @ResponseMessage('Increase view of manga successful')
  async increaseViewOfManga(@Param('id', ParseIntPipe) id: number) {
    return {
      metadata: await this.mangaService.increaseViewOfManga(id),
    };
  }
}
