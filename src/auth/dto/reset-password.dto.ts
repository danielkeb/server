import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Email address of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'New password not less than 8 character',
    minLength: 8,
    maxLength: 20,
    type: String,
  })
  @IsString()
  @Length(8, 20, {
    message: 'Password must be between 8 and 20 characters long.',
  })
  newPassword: string;
}
