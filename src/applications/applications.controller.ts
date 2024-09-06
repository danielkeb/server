import { Controller, Get, Param, Req } from '@nestjs/common';
import { Role } from 'src/RBAC/role.enum';
import { Roles } from 'src/RBAC/roles.decorator';
import { ApplicationsService } from './applications.service';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Roles(Role.Volunteer)
  @Get('check/:projectId')
  checkApplication(@Req() req, @Param('projectId') projectId: string) {
    const userId = req.user.sub;
    return this.applicationsService.checkApplication(userId, projectId);
  }

  @Roles(Role.Volunteer)
  @Get('myApplications')
  getMyApplications(@Req() req) {
    const userId = req.user.sub;
    return this.applicationsService.getMyApplications(userId);
  }

  @Get(':projectId')
  getApplicationsByProjectId(@Param('projectId') projectId: string) {
    return this.applicationsService.getApplicationsByProjectId(projectId);
  }

  @Roles(Role.Volunteer)
  @Get('accept/:applicationId')
  acceptApplication(@Param('applicationId') applicationId: string) {
    return this.applicationsService.acceptApplication(applicationId);
  }

  @Roles(Role.Volunteer)
  @Get('reject/:applicationId')
  rejectApplication(@Param('applicationId') applicationId: string) {
    return this.applicationsService.rejectApplication(applicationId);
  }
}
