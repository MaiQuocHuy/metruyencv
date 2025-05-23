import { ApiProperty, ApiSchema, PickType } from '@nestjs/swagger';
import { CreateCommentDto } from './create-comment.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

@ApiSchema({ description: 'Description of the UpdateCommentDto schema' })
export class UpdateCommentDto extends PickType(CreateCommentDto, [
  'comment_content' as const,
]) {
  @ApiProperty()
  @IsNotEmpty({ message: 'Comment id is required' })
  @IsNumber()
  @Transform(({ value }) => {
    if (value === '') return -1;
    return Number(value);
  })
  comment_id: number;
}
