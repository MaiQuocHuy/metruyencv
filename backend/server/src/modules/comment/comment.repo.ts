import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from './models/comment.model';
import { Sequelize } from 'sequelize';
import { Op } from 'sequelize';
import PaginateUtil from 'src/shared/utils/paginate.util';

@Injectable()
export class CommentRepo {
  constructor(@InjectModel(Comment) private commentModel: typeof Comment) {}

  async getMaxRightValue(chapterId: number): Promise<number> {
    const maxRightValue: number = await this.commentModel.max('comment_right', {
      where: { comment_chapter_id: chapterId },
    });
    return maxRightValue | 0;
  }

  async createComment(
    comment: Comment,
    options: object = {},
  ): Promise<Comment> {
    return await this.commentModel.create(comment.toJSON(), options);
  }

  async findCommentById(commentId: number): Promise<Comment> {
    return this.commentModel.findByPk(commentId);
  }

  async updateManyRightValue(
    rightValue: number,
    chapterId: number,
    options: object = {},
  ): Promise<any> {
    await this.commentModel.update(
      { comment_right: Sequelize.literal('comment_right + 2') },
      {
        where: {
          comment_chapter_id: chapterId,
          comment_right: { [Op.gte]: rightValue },
        },
        ...options,
      },
    );
  }

  async updateManyLeftValue(
    rightValue: number,
    chapterId: number,
    options: object = {},
  ): Promise<any> {
    await this.commentModel.update(
      { comment_left: Sequelize.literal('comment_left + 2') },
      {
        where: {
          comment_chapter_id: chapterId,
          comment_left: { [Op.gte]: rightValue },
        },
        ...options,
      },
    );
  }

  async getRootCommentsOfChapterWithPaginate({
    page,
    limit,
    chapterId,
    options = {},
  }: {
    page: number;
    limit: number;
    chapterId: number;
    options?: object;
  }): Promise<any> {
    const offset = (page - 1) * limit;
    const { rows: data, count: total } =
      await this.commentModel.findAndCountAll({
        where: {
          is_deleted: false,
          comment_chapter_id: chapterId,
          comment_parent_id: null,
        },
        ...options,
        limit,
        offset,
        order: [['updatedAt', 'DESC']],
      });

    return {
      data,
      pagination: PaginateUtil.paginationReturn({ page, total, limit, offset }),
    };
  }

  async getCommentsByParentIdWithPaginate({
    page,
    limit,
    chapterId,
    leftValue,
    rightValue,
    options = {},
  }: {
    page: number;
    limit: number;
    chapterId: number;
    leftValue: number;
    rightValue: number;
    options?: object;
  }): Promise<any> {
    const offset = (page - 1) * limit;
    const { rows: data, count: total } =
      await this.commentModel.findAndCountAll({
        where: {
          is_deleted: false,
          comment_chapter_id: chapterId,
          comment_left: { [Op.gte]: leftValue },
          comment_right: { [Op.lte]: rightValue },
        },
        ...options,
        limit,
        offset,
        order: [['updatedAt', 'DESC']],
      });

    return {
      data,
      pagination: PaginateUtil.paginationReturn({ page, total, limit, offset }),
    };
  }

  async deleteComments(
    chapterId: number,
    leftValue: number,
    rightValue: number,
    options: object = {},
  ): Promise<number> {
    return await this.commentModel.destroy({
      where: {
        comment_chapter_id: chapterId,
        comment_left: {
          [Op.and]: [{ [Op.gte]: leftValue }, { [Op.lte]: rightValue }],
        },
      },
      ...options,
    });
  }

  async updateLeftValueOfComments(
    chapterId: number,
    rightValue: number,
    width: number,
    options: object = {},
  ): Promise<number> {
    const [affectedCount] = await this.commentModel.update(
      { comment_left: Sequelize.literal(`comment_left + ${width}`) },
      {
        where: {
          comment_chapter_id: chapterId,
          comment_left: { [Op.gt]: rightValue },
        },
        ...options,
      },
    );
    return affectedCount;
  }

  async updateRightValueOfComments(
    chapterId: number,
    rightValue: number,
    width: number,
    options: object = {},
  ): Promise<number> {
    const [affectedCount] = await this.commentModel.update(
      { comment_right: Sequelize.literal(`comment_right + ${width}`) },
      {
        where: {
          comment_chapter_id: chapterId,
          comment_right: { [Op.gt]: rightValue },
        },
        ...options,
      },
    );
    return affectedCount;
  }

  async updateContentOfComment(
    chapterId: number,
    commentId: number,
    content: string,
    options: object = {},
  ): Promise<number> {
    const [affectedCount] = await this.commentModel.update(
      {
        comment_content: content,
      },
      {
        where: {
          comment_chapter_id: chapterId,
          comment_id: commentId,
        },
        ...options,
      },
    );
    return affectedCount;
  }
}
