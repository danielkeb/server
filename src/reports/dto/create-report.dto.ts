import { ReportContentTypes, ReportReasons } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateReportDto {
  @IsEnum(ReportContentTypes)
  contentType: ReportContentTypes;

  @IsString()
  contentId: string;

  @IsEnum(ReportReasons)
  reason: ReportReasons;

  @IsString()
  @IsOptional()
  description: string;
}
