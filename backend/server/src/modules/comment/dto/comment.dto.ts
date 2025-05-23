import { PartialType } from '@nestjs/swagger';
import { Comment } from '../models/comment.model';
export class CommentDto extends PartialType(Comment) {}
