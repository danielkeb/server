import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { Role } from 'src/RBAC/role.enum';
import { Roles } from 'src/RBAC/roles.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Roles(Role.Volunteer)
  @Post(':projectId')
  create(
    @Req() req,
    @Param('projectId') projectId: string,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    const userId = req.user.sub;
    return this.tasksService.create(userId, projectId, createTaskDto);
  }

  @Get(':projectId')
  findAllByProjectId(@Param('projectId') projectId: string) {
    return this.tasksService.findAllByProjectId(projectId);
  }

  @Roles(Role.Volunteer)
  @Patch(':taskId')
  toggleTaskStatus(@Req() req, @Param('taskId') taskId: string) {
    const userId = req.user.sub;
    return this.tasksService.toggleTaskStatus(userId, taskId);
  }

  @Delete(':taskId')
  deleteTask(@Req() req, @Param('taskId') taskId: string) {
    const userId = req.user.sub;
    return this.tasksService.deleteTask(userId, taskId);
  }
}
