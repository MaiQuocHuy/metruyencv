import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFloatPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { SwaggerApiOperation } from '@common/constants';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ResponseMessage } from '@common/decorators/response-message.decorator';
import { AuthorizeAction } from '@common/decorators/authorize-action.decorator';
import { AtLeastOneFieldPipe } from '@common/pipes/at-least-one-field.pipe';
import { GuestRole } from '@common/decorators/roles.decorator';
import { CommentDto } from './dto/comment.dto';
import { PaginatedDto } from 'src/shared/dto/paginate.dto';
import { ApiPaginateQuery } from '@common/decorators/api-paginate-query.decorator';
import { UpdateCommentDto } from './dto/update-comment.dto';
@ApiBearerAuth()
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({
    summary: 'User and Admin can Create comment',
    description: `
   - **${SwaggerApiOperation.NEED_AUTH}**
     `,
  })
  @Post()
  @ResponseMessage('Create Comment successful')
  @AuthorizeAction({ action: 'createOwn', resource: 'Comments' })
  async createComment(
    @Req() req: Request,
    @Body(new AtLeastOneFieldPipe({ removeAllEmptyField: true }))
    createCommentDto: CreateCommentDto,
  ) {
    const comment = await this.commentService.createComment(
      createCommentDto,
      req['user']['sub'],
    );
    return {
      metadata: req['permission'].filter(comment),
    };
  }

  @ApiOperation({
    summary: 'User get comments of chapter',
    description: `
   - **${SwaggerApiOperation.NOT_NEED_AUTH}**
     `,
  })
  @Get()
  @ApiQuery({
    name: 'chapterId',
    type: Number,
    description: 'Chapter id',
  })
  @ApiQuery({
    name: 'parentId',
    type: Number,
    required: false,
    description: 'Parent id',
  })
  @ResponseMessage('Get Comments successful')
  @AuthorizeAction({ action: 'readAny', resource: 'Comments' })
  @GuestRole(true)
  @ApiPaginateQuery()
  async getRootCommentsOfChapter(
    @Req() req: Request,
    @Query('chapterId') chapterId: number,
    @Query('parentId') parentId: number,
    @Query() paginateDto: PaginatedDto<CommentDto>,
  ) {
    const data: PaginatedDto<CommentDto> =
      await this.commentService.getCommentsOfChapterWithPaginate(
        chapterId,
        parentId,
        paginateDto,
      );
    const { results, ...pagination } = data;
    return {
      metadata: req['permission'].filter(results),
      option: {
        pagination,
      },
    };
  }

  @ApiOperation({
    summary: 'User delete comments of chapter by comment id',
    description: `
   - **${SwaggerApiOperation.NEED_AUTH}**
     `,
  })
  @Delete()
  @ApiQuery({
    name: 'chapterId',
    type: Number,
    description: 'Chapter id',
  })
  @ApiQuery({
    name: 'commentId',
    type: Number,
    required: true,
    description: 'Comment id',
  })
  @ResponseMessage('Delete Comments successful')
  @AuthorizeAction({ action: 'deleteOwn', resource: 'Comments' })
  async deleteComments(
    @Req() req: Request,
    @Query('chapterId') chapterId: number,
    @Query('commentId') commentId: number,
  ) {
    return {
      metadata: await this.commentService.deleteComments(chapterId, commentId),
    };
  }

  @ApiOperation({
    summary: 'User update comment of chapter by comment id',
    description: `
   - **${SwaggerApiOperation.NEED_AUTH}**
     `,
  })
  @Patch()
  @ApiQuery({
    name: 'chapterId',
    type: Number,
    description: 'Chapter id',
  })
  @ResponseMessage('Update Comment successful')
  @AuthorizeAction({ action: 'updateOwn', resource: 'Comments' })
  async updateComment(
    @Req() req: Request,
    @Query('chapterId') chapterId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return {
      metadata: await this.commentService.updateComment(
        chapterId,
        updateCommentDto,
      ),
    };
  }
}
