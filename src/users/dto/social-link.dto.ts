import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUrl } from 'class-validator';

export class SocialLinkDto {
  @ApiProperty({
    enum: ['LinkedIn', 'GitHub', 'Behance', 'Dribbble', 'Instagram', 'Website'],
    description: 'Social media platform',
  })
  @IsEnum({
    LINKEDIN: 'LinkedIn',
    GITHUB: 'GitHub',
    BEHANCE: 'Behance',
    DRIBBBLE: 'Dribbble',
    INSTAGRAM: 'Instagram',
    WEBSITE: 'Website',
  })
  platform: string;

  @ApiProperty({ description: 'URL of the social media profile' })
  @IsUrl()
  @IsOptional()
  url?: string;
}
