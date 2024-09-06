import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsEnum([1, 2, 3, 4])
  priority: number;

  @IsDateString()
  deadline: Date;

  @IsString()
  assignedToId?: string;
}
