import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  @ApiProperty({ description: 'Name of the location' })
  name: string;

  @IsString()
  @ApiProperty({ description: 'Code of the location' })
  code: string;
}
