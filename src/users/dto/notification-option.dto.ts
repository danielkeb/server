import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum } from 'class-validator';

export class NotificationOptionDto {
  @ApiProperty({
    enum: [
      'task_assigned',
      'new_project_recommendation',
      'project_status_update',
      'deadlines',
      'application_status_update',
      'badge_and_certificate',
    ],
    description: 'Notification option type',
  })
  @IsEnum({
    task_assigned: 'task_assigned',
    new_project_recommendation: 'new_project_recommendation',
    project_status_update: 'project_status_update',
    deadlines: 'deadlines',
    application_status_update: 'application_status_update',
    badge_and_certificate: 'badge_and_certificate',
  })
  option: string;

  @ApiProperty({
    description: 'Notification option value. (True or False)',
  })
  @IsBoolean()
  value: boolean;
}
