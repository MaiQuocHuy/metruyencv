import { IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import {
  ApiPropertyOptional,
  ApiSchema,
  PartialType,
  PickType,
} from '@nestjs/swagger';

@ApiSchema({ description: 'Description of the UpdateUserDto schema' })
export class UpdateUserDto extends PartialType(
  PickType(CreateUserDto, ['usr_name'] as const), //when user name is updated, user slug will be updated too
) {
  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  usr_avatar: Express.Multer.File;

  @ApiPropertyOptional()
  @IsString({ message: 'Invalid format' })
  @IsOptional()
  usr_sex: string;
}
