import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @ApiProperty({
    description: 'Current password of the user',
  })
  currentPassword: string;

  @IsString()
  @ApiProperty({
    description: 'The changed password',
  })
  password: string;
}
