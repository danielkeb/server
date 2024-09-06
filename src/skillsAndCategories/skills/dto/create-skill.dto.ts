import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateSkillDto {
  @ApiProperty({ description: 'Name of the skill' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Description of the skill' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'ID of the category to which the skill belongs' })
  @IsString()
  categoryId: string;
}
