import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@ApiSchema({ description: 'Description of the CreateUserDto schema' })
export class CreateUserDto {
  @ApiProperty({
    example: 'abcxyz@gmail.com',
    uniqueItems: true,
  })
  @IsEmail({}, { message: 'Invalid email format' })
  usr_email: string;

  @ApiProperty({
    example: 'abcxyz123',
  })
  @MinLength(7, { message: 'Password must be at least 8 characters long' })
  @IsNotEmpty({ message: 'Password is required' })
  usr_password: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Name is required' })
  usr_name: string;
}
