import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

@ApiSchema({ description: 'Description of the SignInDto schema' })
export class SignInDto {
  @ApiProperty({
    example: 'abcxyz@gmail.com',
    uniqueItems: true,
    type: String,
  })
  @IsEmail({}, { message: 'Invalid email format' })
  usr_email: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty({ message: 'Password is required' })
  usr_password: string;
}
