import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class UpdateProfilePicDto {
  @ApiProperty({
    description: 'Email address of the user',
  })
  @IsEmail()
  email: string;
}
