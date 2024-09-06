import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from 'src/RBAC/role.enum';
import { Roles } from 'src/RBAC/roles.decorator';
import { Public } from 'src/auth/decorators/public.decorator';
import { ApiGetSummaryEndpoint } from './docs/stats-controllers.doc';
import { StatsService } from './stats.service';

@ApiTags('Stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Public()
  @ApiGetSummaryEndpoint()
  @Get('summary')
  getUserInfo() {
    return this.statsService.getSummary();
  }

  @Roles(Role.Admin)
  @Get('age-and-gender')
  getAgeAndGenderCount() {
    return this.statsService.getAgeAndGenderCount();
  }

  @Roles(Role.Admin)
  @Get('projectStat')
  getProjectStat() {
    return this.statsService.projectStat();
  }

  @Roles(Role.Admin)
  @Get('verifiedAndNotVerified')
  verifiedAndNotVerified() {
    return this.statsService.verifiedAndNotVerified();
  }

  @Roles(Role.Admin)
  @Get('reportStat')
  reportStat() {
    return this.statsService.reportStats();
  }

  @Roles(Role.Admin)
  @Get('popularSkills')
  getPopularSkills() {
    return this.statsService.getPopularSkills();
  }

  @Get(':projectId/progress')
  getProjectProgress(@Param('projectId') projectId: string) {
    return this.statsService.getProjectProgress(projectId);
  }
}
