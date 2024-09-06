import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @ApiProperty({ description: 'The name of the organization' })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'The mission statement of the organization' })
  mission?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Short description of the organization' })
  aboutUs?: string;

  @IsUrl()
  @IsOptional()
  @ApiProperty({ description: "The URL of the organization's website" })
  websiteUrl: string;

  @IsString()
  @ApiProperty({
    description: 'The ID of the location where the organization is based',
  })
  locationId: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({
    description: "The email address of the organization's contact",
  })
  contactEmail?: string;

  @IsPhoneNumber()
  @ApiProperty({
    description: "The phone number of the organization's contact",
  })
  contactPhone: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ description: 'The founding date of the organization' })
  foundingDate?: Date;

  @IsOptional()
  @IsBoolean()
  verified: boolean;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}
