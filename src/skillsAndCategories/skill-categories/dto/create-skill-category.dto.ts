import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateSkillCategoryDto {
  @ApiProperty({ description: 'Name of the skill category' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Description of the skill category' })
  @IsString()
  description: string;
}
