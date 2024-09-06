import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class VerifyCodeDto {
  @IsString()
  @ApiProperty({
    description: 'Reset/Verification code sent to the user by email',
  })
  code: string;

  @IsEmail()
  @ApiProperty({
    description: 'Email address of the user',
  })
  email: string;
}
