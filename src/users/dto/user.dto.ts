import { ApiProperty } from '@nestjs/swagger';
import { Gender, LocationPreference, TimePreference } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { EducationInfoDto } from './education-info.dto';
import { NotificationOptionDto } from './notification-option.dto';
import { SocialLinkDto } from './social-link.dto';

export class UserDto {
  @ApiProperty({ description: 'First name of the user' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Last name of the user' })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'Username of the user' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'Email address of the user' })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Bio text of the user',
  })
  @IsString()
  bio: string;

  @ApiProperty({ description: "ID of the user's location" })
  @IsString()
  locationId: string;

  @ApiProperty({
    description: 'Location preference of the user',
    enum: LocationPreference,
  })
  @IsEnum(LocationPreference)
  locationPreference: string;

  @ApiProperty({
    description: 'Time preference of the user',
    enum: TimePreference,
  })
  @IsEnum(TimePreference)
  timePreference: string;

  @ApiProperty({
    description: 'Token',
  })
  @IsString()
  token: string;

  @ApiProperty({
    description: "6 digit code sent to the user's email to reset password",
  })
  @IsString()
  resetCode: string;

  @ApiProperty({
    description: "6 digit code sent to the user's email to verify email",
  })
  @IsString()
  verificationCode: string;

  @ApiProperty({
    description: 'A list of key value pairs containing the users social links',
    type: [SocialLinkDto],
  })
  @IsArray()
  @ValidateNested({ each: true }) // Validate each element of the array
  @Type(() => SocialLinkDto) // Specify the type of each element
  socialLinks: SocialLinkDto[];

  @ApiProperty({
    description: 'An object containing the users notification preference',
  })
  @IsArray()
  @ValidateNested({ each: true }) // Validate each element of the array
  @Type(() => NotificationOptionDto) // Specify the type of each element
  notificationPreference: NotificationOptionDto[];

  @ApiProperty({ description: 'Gender of the user' })
  @IsEnum(Gender)
  gender: string;

  @ApiProperty({ description: 'Age of the user' })
  @IsInt()
  @Min(18, { message: 'The user must be at least 18 years old' })
  age: number;

  @ApiProperty({ description: 'IDs of the users skills' })
  @IsString({ each: true })
  skills: string[];

  @ApiProperty({
    description:
      'A list of key value pairs containing the users education information',
    type: [EducationInfoDto],
  })
  @IsArray()
  @ValidateNested({ each: true }) // Validate each element of the array
  @Type(() => EducationInfoDto) // Specify the type of each element
  education: EducationInfoDto[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
