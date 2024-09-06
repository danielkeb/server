import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class EducationInfoDto {
  @ApiProperty({ description: 'Field of education' })
  @IsString()
  field: string;

  @ApiProperty({
    description: 'Name of the institute, school, college or university',
  })
  @IsString()
  institute: string;

  @ApiProperty({
    type: String,
    description: 'Start date of education',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'End date of education. If empty then ongoing education',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  endDate: string;

  @ApiProperty({
    description: 'Optional description of the education',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
