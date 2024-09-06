import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    projectId: string,
    createTaskDto: CreateTaskDto,
  ) {
    try {
      // Check if the project exists
      const project = await this.prisma.projects.findUnique({
        where: { id: projectId },
      });
      if (!project) {
        throw new NotFoundException('Project not found');
      }

      // Check if the user own the organization/project
      const user = await this.prisma.users.findUnique({
        where: { id: userId },
      });
      if (
        !user.organizationId ||
        user.organizationId !== project.organizationId
      ) {
        throw new ForbiddenException(
          'The user is not allowed to access this resource.',
        );
      }

      // Check if the user to be assigned exists
      const toUser = await this.prisma.users.findUnique({
        where: {
          id: createTaskDto.assignedToId,
        },
      });
      if (!toUser) {
        throw new NotFoundException('User to be assigned not found');
      }

      // Create a new record in the tasks table
      const newTask = await this.prisma.tasks.create({
        data: {
          deadline: createTaskDto.deadline,
          title: createTaskDto.title,
          description: createTaskDto.description,
          priority: createTaskDto.priority,
          assignedTo: {
            connect: { id: createTaskDto.assignedToId },
          },
          project: {
            connect: { id: projectId },
          },
        },
      });

      return newTask;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to create task');
      }
    }
  }

  async findAllByProjectId(projectId: string) {
    try {
      // Check if project exists
      const project = await this.prisma.projects.findUnique({
        where: { id: projectId },
      });
      if (!project) {
        throw new NotFoundException('Project not found');
      }

      // Fetch all tasks
      const tasks = await this.prisma.tasks.findMany({
        where: { projectId },
        include: {
          assignedTo: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              gender: true,
              age: true,
              username: true,
              email: true,
              bio: true,
            },
          },
          project: {
            select: {
              organization: {
                select: {
                  owner: {
                    select: {
                      id: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          status: 'asc',
        },
      });

      return tasks;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to load projects');
      }
    }
  }

  async toggleTaskStatus(userId: string, taskId: string) {
    try {
      // Check if task exists
      const task = await this.prisma.tasks.findUnique({
        where: { id: taskId },
        include: {
          project: {
            include: {
              organization: {
                select: {
                  owner: {
                    select: {
                      id: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      if (!task) {
        throw new NotFoundException('Task not found');
      }

      // Check if the user is allowed to complete the task
      if (
        task.assignedToId !== userId &&
        task.project.organization.owner.id !== userId
      ) {
        throw new ForbiddenException(
          'You are not allowed to change the status of this task',
        );
      }

      // Update task status
      return this.prisma.tasks.update({
        where: { id: taskId },
        data: {
          status: task.status === 'COMPLETED' ? 'OPEN' : 'COMPLETED',
        },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to update task');
      }
    }
  }

  async deleteTask(userId: string, taskId: string) {
    try {
      // Check if the user is allowed to delete the task
      const task = await this.prisma.tasks.findUnique({
        where: { id: taskId },
        include: {
          project: {
            include: {
              organization: {
                select: {
                  owner: {
                    select: {
                      id: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      if (!task) {
        throw new NotFoundException('Task not found');
      }
      if (task.project.organization.owner.id !== userId) {
        throw new ForbiddenException('You are not allowed to delete this task');
      }

      // Delete task
      await this.prisma.tasks.delete({
        where: { id: taskId },
      });

      return { message: 'Task deleted successfully' };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to delete task');
      }
    }
  }
}
