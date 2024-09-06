import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    description: 'User email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password' })
  @IsString()
  @Length(8, 20, {
    message: 'Password must be between 8 and 20 characters long.',
  })
  password: string;
}
