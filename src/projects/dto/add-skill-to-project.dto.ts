import { IsNumber, IsString, Min } from 'class-validator';

export class AddSkillToProjectDto {
  @IsString()
  skillId: string;

  @IsNumber()
  @Min(1)
  vacancies: number;
}
