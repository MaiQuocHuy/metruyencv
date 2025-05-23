import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ description: 'Description of the ChangePasswordDto schema' })
export class ChangePasswordDto {
  @ApiProperty()
  @MinLength(7, { message: 'Password must be at least 8 characters long' })
  @IsNotEmpty({ message: 'Old password is required' })
  oldPassWord: string;

  @ApiProperty()
  @MinLength(7, { message: 'Password must be at least 8 characters long' })
  @IsNotEmpty({ message: 'Old password is required' })
  newPassword: string;
}
