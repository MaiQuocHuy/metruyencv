import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Comment } from './models/comment.model';
import { ChapterModule } from '@modules/chapter/chapter.module';
import { CommentRepo } from './comment.repo';

@Module({
  imports: [SequelizeModule.forFeature([Comment]), ChapterModule],
  controllers: [CommentController],
  providers: [CommentService, CommentRepo],
})
export class CommentModule {}
