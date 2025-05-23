import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Req,
  UseInterceptors,
  UploadedFile,
  Query,
  Param,
  ParseIntPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { SwaggerApiOperation } from '@common/constants';
import { AuthorizeAction } from '@common/decorators/authorize-action.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginatedDto } from 'src/shared/dto/paginate.dto';
import { UserDto } from './dto/user.dto';
import { ApiPaginateQuery } from '@common/decorators/api-paginate-query.decorator';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'User sign-up',
    description: `
  - **${SwaggerApiOperation.NOT_NEED_AUTH}**
  - **${SwaggerApiOperation.NOT_REQUIRE_CLIENT_ID}**
  - your password have to be at least 7 characters long
    `,
  })
  @Post('sign-up')
  @ResponseMessage('User created successfully')
  async create(@Body() createUserDto: CreateUserDto) {
    return {
      metadata: await this.userService.create(createUserDto),
    };
  }

  @ApiOperation({
    summary: 'User change password',
    description: `
  - **${SwaggerApiOperation.NEED_AUTH}**
        `,
  })
  @Patch('change-password')
  @ResponseMessage('Change password successfully')
  @AuthorizeAction({ action: 'updateOwn', resource: 'Users' })
  async changePassword(
    @Req() req: Request,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const userId = req['user']['sub'];
    return {
      metadata: await this.userService.changePassword(
        userId,
        changePasswordDto,
      ),
    };
  }

  @ApiOperation({
    summary: 'User update personal information',
    description: `
  - **${SwaggerApiOperation.NEED_AUTH}**
        `,
  })
  @Patch('update-profile')
  @ResponseMessage('Update profile successfully')
  @UseInterceptors(FileInterceptor('usr_avatar'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create Manga',
    type: UpdateUserDto,
  })
  @AuthorizeAction({ action: 'updateOwn', resource: 'Users' })
  async updateUserProfile(
    @Req() req: Request,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = req['user']['sub'];
    return {
      metadata: await this.userService.updateUserProfile(
        userId,
        updateUserDto,
        file,
      ),
    };
  }

  @ApiOperation({
    summary: 'Admin get list user',
    description: `
  - **${SwaggerApiOperation.NEED_AUTH}**
  - Only **admin** can use this API.
        `,
  })
  @Get('users')
  @ResponseMessage('Get list user successfully')
  @AuthorizeAction({ action: 'readAny', resource: 'Users' })
  @ApiPaginateQuery()
  async getListUserWithPaginate(
    @Req() req: Request,
    @Query() paginateDto: PaginatedDto<UserDto>,
  ) {
    const data: PaginatedDto<UserDto> =
      await this.userService.getListUserWithPaginate(paginateDto);
    const { results, ...pagination } = data;
    return {
      metadata: req['permission'].filter(results),
      option: {
        pagination,
      },
    };
  }

  @ApiOperation({
    summary: 'User get details information',
    description: `
  - **${SwaggerApiOperation.NEED_AUTH}**
  - User can get their own information.
        `,
  })
  @Get(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Id of user',
  })
  @ResponseMessage('User get information successfully')
  @AuthorizeAction({ action: 'readOwn', resource: 'Users' })
  @ApiPaginateQuery()
  async getDetailsInfo(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const userId = req['user']['sub'];
    if (userId != id)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    return {
      metadata: await this.userService.getDetailsInfo(id),
    };
  }
}
