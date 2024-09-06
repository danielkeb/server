import { IsOptional, IsString } from 'class-validator';

export class ApplyToProjectDto {
  @IsString()
  @IsOptional()
  message?: string;
}
