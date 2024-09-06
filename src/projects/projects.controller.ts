import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Role } from 'src/RBAC/role.enum';
import { Roles } from 'src/RBAC/roles.decorator';
import { Public } from 'src/auth/decorators/public.decorator';
import { AddSkillToProjectDto } from './dto/add-skill-to-project.dto';
import { ApplyToProjectDto } from './dto/apply.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Roles(Role.Volunteer)
  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Public()
  @Get('latest/:days?')
  getLatestProjects(@Param('days') days?: number) {
    if (days === undefined) {
      days = 7;
    }

    return this.projectsService.getLatestProjects(days);
  }

  @Public()
  @Get('in-progress/:organizationId')
  getInProgressProjects(@Param('organizationId') organizationId: string) {
    return this.projectsService.getInProgressProjects(organizationId);
  }

  @Public()
  @Get('finished/:organizationId')
  getFinishedProjects(@Param('organizationId') organizationId: string) {
    return this.projectsService.getFinishedProjects(organizationId);
  }

  @Public()
  @Get()
  getFilteredProjects(@Query() queryParams: any) {
    return this.projectsService.getFilteredProjects(queryParams);
  }

  @Public()
  @Get(':id')
  getProjectById(@Param('id') id: string) {
    return this.projectsService.findOneById(id);
  }

  @Roles(Role.Volunteer)
  @Post(':projectId/apply')
  apply(
    @Req() req,
    @Param('projectId') projectId: string,
    @Body() applyToProjectDto: ApplyToProjectDto,
  ) {
    const userId = req.user.sub;
    return this.projectsService.apply(
      projectId,
      userId,
      applyToProjectDto.message,
    );
  }

  @Patch(':projectId/edit')
  update(
    @Param('projectId') projectId: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(projectId, updateProjectDto);
  }

  @Roles(Role.Volunteer)
  @Post(':projectId/skills')
  addSkills(
    @Param('projectId') projectId: string,
    @Body() addSkillToProject: AddSkillToProjectDto,
  ) {
    return this.projectsService.addSkillsToProject(
      projectId,
      addSkillToProject,
    );
  }

  @Roles(Role.Volunteer)
  @Delete(':projectId/skills/:skillId')
  removeSkill(
    @Param('projectId') projectId: string,
    @Param('skillId') skillId: string,
  ) {
    return this.projectsService.removeSkill(projectId, skillId);
  }

  @Get(':projectId/participants')
  getParticipants(@Param('projectId') projectId: string) {
    return this.projectsService.fetchProjectParticipants(projectId);
  }

  @Roles(Role.Volunteer)
  @Get(':projectId/check-owner')
  checkOwner(@Param('projectId') projectId: string, @Req() req) {
    const userId = req.user.sub;
    return this.projectsService.checkOwner(projectId, userId);
  }
}
