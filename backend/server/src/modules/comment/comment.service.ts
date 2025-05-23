import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CommentRepo } from './comment.repo';
import Util from '@common/services/util.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './models/comment.model';
import { ChapterService } from '@modules/chapter/chapter.service';
import { Sequelize } from 'sequelize-typescript';
import { PaginatedDto } from 'src/shared/dto/paginate.dto';
import { CommentDto } from './dto/comment.dto';
import PaginateUtil from 'src/shared/utils/paginate.util';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from '@modules/user/models/user.model';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepo: CommentRepo,
    private util: Util,
    private readonly chapterService: ChapterService,
    private sequelize: Sequelize,
  ) {}

  async createComment(
    createCommentDto: CreateCommentDto,
    userId: number,
  ): Promise<Comment> {
    const {
      comment_chapter_id,
      comment_content,
      comment_parent_id = null,
    } = createCommentDto;

    const foundChapter =
      await this.chapterService.findChapterById(comment_chapter_id);

    // create new comment obj
    const commentId = this.util.generateIdByTime();
    const newComment = new Comment({
      comment_id: commentId,
      comment_user_id: userId,
      comment_content: comment_content,
      comment_chapter_id: comment_chapter_id,
      comment_manga_id: foundChapter.chap_manga_id,
      comment_parent_id: comment_parent_id,
    });

    const result = this.sequelize.transaction(async (t) => {
      let rightValue: number;
      if (comment_parent_id) {
        // find parent comment, then create reply comment
        const parentComment =
          await this.commentRepo.findCommentById(comment_parent_id);
        if (!parentComment)
          throw new HttpException(
            'Parent comment not found',
            HttpStatus.NOT_FOUND,
          );

        rightValue = parentComment.comment_right;

        // Update many right and left value
        await this.commentRepo.updateManyRightValue(
          rightValue,
          comment_chapter_id,
          { transaction: t },
        );
        await this.commentRepo.updateManyLeftValue(
          rightValue,
          comment_chapter_id,
          { transaction: t },
        );
      } else {
        const maxRightValue =
          await this.commentRepo.getMaxRightValue(comment_chapter_id);
        rightValue = maxRightValue + 1;
      }

      newComment.comment_left = rightValue;
      newComment.comment_right = rightValue + 1;

      return (
        await this.commentRepo.createComment(newComment, { transaction: t })
      ).get({
        plain: true,
      });
    });
    return result;
  }

  async getCommentsOfChapterWithPaginate(
    chapterId: number,
    parentId: number = null,
    paginateDto: PaginatedDto<CommentDto>,
  ): Promise<PaginatedDto<CommentDto>> {
    await this.chapterService.findChapterById(chapterId);

    if (parentId) {
      return this.getCommentsByParentIdWithPaginate(
        chapterId,
        parentId,
        paginateDto,
      );
    }

    const { limit, page } = paginateDto;
    const includeCondition = [
      {
        model: User,
        as: 'user',
        attributes: ['usr_id', 'usr_name'],
      },
    ];
    const { data, pagination } =
      await this.commentRepo.getRootCommentsOfChapterWithPaginate({
        page,
        limit,
        chapterId,
        options: { nest: true, include: includeCondition },
      });

    const dataToReturn = data.map((item) => {
      return item.get({ plain: true });
    });

    paginateDto = PaginateUtil.setPaginateDto(
      paginateDto,
      dataToReturn,
      pagination,
    );
    return paginateDto;
  }

  async getCommentsByParentIdWithPaginate(
    chapterId: number,
    parentId: number,
    paginateDto: PaginatedDto<CommentDto>,
  ): Promise<PaginatedDto<CommentDto>> {
    const parent = await this.commentRepo.findCommentById(parentId);
    if (!parent)
      throw new HttpException('Parent comment not found', HttpStatus.NOT_FOUND);

    const { limit, page } = paginateDto;
    const includeCondition = [
      {
        model: User,
        as: 'user',
        attributes: ['usr_id', 'usr_name'],
      },
    ];
    const { data, pagination } =
      await this.commentRepo.getCommentsByParentIdWithPaginate({
        page,
        limit,
        chapterId,
        leftValue: parent.comment_left,
        rightValue: parent.comment_right,
        options: { nest: true, include: includeCondition },
      });

    const dataToReturn = data.map((item) => {
      return item.get({ plain: true });
    });

    paginateDto = PaginateUtil.setPaginateDto(
      paginateDto,
      dataToReturn,
      pagination,
    );
    return paginateDto;
  }

  async deleteComments(chapterId: number, commentId: number): Promise<number> {
    await this.chapterService.findChapterById(chapterId);

    const comment = await this.commentRepo.findCommentById(commentId);
    if (!comment)
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);

    const rightValue = comment.comment_right;
    const leftValue = comment.comment_left;

    const width = rightValue - leftValue + 1;

    const result = await this.sequelize.transaction(async (t) => {
      const isDeleted = await this.commentRepo.deleteComments(
        chapterId,
        leftValue,
        rightValue,
        { transaction: t },
      );

      await this.commentRepo.updateLeftValueOfComments(
        chapterId,
        rightValue,
        -width,
        { transaction: t },
      );

      await this.commentRepo.updateRightValueOfComments(
        chapterId,
        rightValue,
        -width,
        { transaction: t },
      );

      return isDeleted;
    });
    return result;
  }

  async updateComment(
    chapterId: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<number> {
    await this.chapterService.findChapterById(chapterId);

    const { comment_content, comment_id } = updateCommentDto;

    const comment = await this.commentRepo.findCommentById(comment_id);
    if (!comment)
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);

    const isUpdated = await this.commentRepo.updateContentOfComment(
      chapterId,
      comment_id,
      comment_content,
    );
    return isUpdated;
  }
}
