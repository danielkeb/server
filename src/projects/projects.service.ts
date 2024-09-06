import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddSkillToProjectDto } from './dto/add-skill-to-project.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto) {
    try {
      // Check if organization exists
      const organizationExists = await this.prisma.organizations.findUnique({
        where: { id: createProjectDto.organizationId },
      });
      if (!organizationExists) {
        throw new NotFoundException(
          'Organization with the specified ID is not found.',
        );
      }

      // Create the project
      const project = await this.prisma.projects.create({
        data: {
          organization: {
            connect: {
              id: createProjectDto.organizationId,
            },
          },
          title: createProjectDto.title,
          description: createProjectDto.description,
          startDate: createProjectDto.startDate,
          endDate: createProjectDto.endDate,
          status: 'NOT_STARTED',
          timeCommitment: createProjectDto.timeCommitment,
          provideCertificate: createProjectDto.provideCertificate,
        },
      });

      // If location is specified, connect it to the project
      if (createProjectDto.locationId) {
        // Validate location existence
        const locationExists = await this.prisma.locations.findFirst({
          where: { id: createProjectDto.locationId },
        });
        if (!locationExists) {
          throw new NotFoundException('Location not found');
        }

        const updatedProject = await this.prisma.projects.update({
          where: { id: project.id },
          data: {
            location: {
              connect: {
                id: createProjectDto.locationId,
              },
            },
          },
        });

        return updatedProject;
      }

      return project;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Failed to create project. Please try again.',
        );
      }
    }
  }

  async getLatestProjects(days: number) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const projects = await this.prisma.projects.findMany({
        where: {
          AND: [
            {
              createdAt: {
                gte: cutoffDate,
              },
            },
            {
              isActive: true,
            },
          ],
        },
        include: {
          location: true,
          organization: true,
          applications: true,
          donations: true,
          messages: true,
          skillsRequired: true,
          tasks: true,
        },
      });
      return projects;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve projects. Please try again.',
      );
    }
  }

  async getInProgressProjects(organizationId: string) {
    try {
      // Check if the organization exists
      const organizationExists = await this.prisma.organizations.findUnique({
        where: { id: organizationId },
      });
      if (!organizationExists) {
        throw new NotFoundException(
          'Organization with the specified ID is not found.',
        );
      }

      // Retrieve in progress projects projects
      const projects = await this.prisma.projects.findMany({
        where: {
          AND: [
            { organizationId: organizationId },
            { status: { not: 'DONE' } },
            { isActive: true },
          ],
        },
        include: {
          location: true,
          organization: true,
          applications: true,
          donations: true,
          messages: true,
          skillsRequired: true,
          tasks: true,
        },
      });

      return projects;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Failed to retrieve projects. Please try again.',
        );
      }
    }
  }

  async getFinishedProjects(organizationId: string) {
    try {
      // Check if the organization exists
      const organizationExists = await this.prisma.organizations.findUnique({
        where: { id: organizationId },
      });
      if (!organizationExists) {
        throw new NotFoundException(
          'Organization with the specified ID is not found.',
        );
      }

      // Retrieve finished projects projects
      const projects = await this.prisma.projects.findMany({
        where: {
          AND: [
            { organizationId: organizationId },
            { status: 'DONE' },
            { isActive: true },
          ],
        },
      });

      return projects;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Failed to retrieve projects. Please try again.',
        );
      }
    }
  }

  async getFilteredProjects(queryParams: any) {
    const { time, location, status, query } = queryParams;

    try {
      let whereClause = {};

      if (query && query.length > 0) {
        whereClause = {
          OR: [
            {
              organization: {
                name: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
            },
            {
              title: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: query,
                mode: 'insensitive',
              },
            },
          ],
        };
      }
      const projects = await this.prisma.projects.findMany({
        where: whereClause,
        include: {
          applications: true,
          donations: true,
          location: true,
          messages: true,
          organization: true,
          skillsRequired: true,
          tasks: true,
        },
      });

      let filteredProjects = projects;

      // Filter projects by time preference
      if (time && time !== 'BOTH') {
        filteredProjects = projects.filter(
          (project) => project.timeCommitment === time,
        );
      }

      // Filter project by project status
      if (status) {
        filteredProjects = filteredProjects.filter(
          (project) => project.status === status,
        );
      }

      // Filter projects by location
      if (location) {
        if (location === 'REMOTE') {
          filteredProjects = filteredProjects.filter(
            (project) => project.locationId === null,
          );
        } else {
          filteredProjects = filteredProjects.filter(
            (project) => project.locationId === location,
          );
        }
      }

      return filteredProjects;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve filtered projects. Please try again.',
      );
    }
  }

  async findOneById(id: string) {
    try {
      const project = await this.prisma.projects.findUnique({
        where: { id },
        include: {
          applications: true,
          donations: true,
          location: true,
          messages: true,
          organization: true,
          skillsRequired: {
            include: {
              skill: true,
            },
          },
          tasks: true,
          reviews: true,
          _count: {
            select: {
              tasks: {
                where: {
                  status: 'OPEN',
                },
              },
            },
          },
        },
      });

      if (!project || !project.isActive) {
        throw new NotFoundException(
          'Project with the specified ID was not found.',
        );
      }

      // Fetch number of reviews and average rating
      const rating = await this.prisma.reviews.aggregate({
        where: {
          projectId: id,
        },
        _avg: {
          rating: true,
        },
        _count: {
          _all: true,
        },
      });

      return {
        ...project,
        rating: {
          avg: rating._avg.rating,
          count: rating._count._all,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return error;
      } else {
        throw new InternalServerErrorException(
          'Failed to retrieve project. Please try again.',
        );
      }
    }
  }

  async apply(projectId: string, userId: string, message: string) {
    try {
      // Check if user exists
      const user = await this.prisma.users.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException("User doesn't exist");
      }

      // Check if project exists
      const project = await this.prisma.projects.findUnique({
        where: { id: projectId },
      });
      if (!project) {
        throw new NotFoundException("Project doesn't exist");
      }

      // Check if the user has already applied
      const existingApplication = await this.prisma.applications.findFirst({
        where: {
          AND: [{ userId: userId }, { projectId: projectId }],
        },
      });
      if (existingApplication) {
        throw new ConflictException('You have already applied to this project');
      }

      // Update project
      await this.prisma.projects.update({
        where: {
          id: projectId,
        },
        data: {
          applications: {
            create: {
              userId: userId,
              message: message,
            },
          },
        },
      });

      return {
        message: 'Applied successfully',
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        return error;
      } else {
        throw new InternalServerErrorException(
          'Failed to apply. Please try again.',
        );
      }
    }
  }

  async update(projectId: string, updateProjectDto: UpdateProjectDto) {
    try {
      // Check if project exists
      const project = await this.prisma.projects.findUnique({
        where: {
          id: projectId,
        },
      });
      if (!project) {
        throw new NotFoundException('Project not found');
      }

      // Update the project
      const updatedProject = await this.prisma.projects.update({
        where: {
          id: projectId,
        },
        data: updateProjectDto,
        include: {
          applications: {
            where: {
              status: 'ACCEPTED',
            },
            select: {
              userId: true,
            },
          },
        },
      });

      // If the project is "DONE" and provideCertificate is true,
      // award certificates to participate
      if (
        updateProjectDto.status === 'DONE' &&
        updatedProject.provideCertificate
      ) {
        for (const record of updatedProject.applications) {
          const { userId } = record;

          const count = await this.prisma.users.findUnique({
            where: {
              id: userId,
            },
            select: {
              _count: {
                select: {
                  applications: {
                    where: {
                      status: 'ACCEPTED',
                      project: {
                        status: 'DONE',
                      },
                    },
                  },
                },
              },
            },
          });

          // One fucking LONG and MESSY code lies here
          try {
            switch (true) {
              case count._count.applications >= 5:
                await this.prisma.usersToBadges.create({
                  data: {
                    user: {
                      connect: {
                        id: userId,
                      },
                    },
                    badge: {
                      connect: {
                        name: 'Diamond',
                      },
                    },
                  },
                });
                break;
              case count._count.applications >= 10:
                await this.prisma.usersToBadges.create({
                  data: {
                    user: {
                      connect: {
                        id: userId,
                      },
                    },
                    badge: {
                      connect: {
                        name: 'Platinum',
                      },
                    },
                  },
                });
                break;
              case count._count.applications >= 20:
                await this.prisma.usersToBadges.create({
                  data: {
                    user: {
                      connect: {
                        id: userId,
                      },
                    },
                    badge: {
                      connect: {
                        name: 'Gold',
                      },
                    },
                  },
                });
                break;
              case count._count.applications >= 10:
                await this.prisma.usersToBadges.create({
                  data: {
                    user: {
                      connect: {
                        id: userId,
                      },
                    },
                    badge: {
                      connect: {
                        name: 'Silver',
                      },
                    },
                  },
                });
                break;
              case count._count.applications >= 5:
                await this.prisma.usersToBadges.create({
                  data: {
                    user: {
                      connect: {
                        id: userId,
                      },
                    },
                    badge: {
                      connect: {
                        name: 'Bronze',
                      },
                    },
                  },
                });
                break;
            }
          } catch (error) {}
        }
      }

      // If the project is "DONE", award appropriate badges to eligible users
      if (updateProjectDto.status === 'DONE') {
        for (const record of updatedProject.applications) {
          const { userId } = record;

          await this.prisma.certificates.create({
            data: {
              userId: userId,
              projectId: projectId,
            },
          });
        }
      }

      return {
        message: 'Project successfully updated',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return error;
      } else {
        throw new InternalServerErrorException(
          'Failed to update project. Please try again',
        );
      }
    }
  }

  async addSkillsToProject(
    projectId: string,
    addSkillToProjectDto: AddSkillToProjectDto,
  ) {
    try {
      // Check if project exists
      const project = await this.prisma.projects.findUnique({
        where: {
          id: projectId,
        },
      });
      if (!project) {
        throw new NotFoundException(
          'Project with the specified ID is not found',
        );
      }

      // Check if skill exist
      const skills = await this.prisma.skills.findUnique({
        where: {
          id: addSkillToProjectDto.skillId,
        },
      });
      if (!skills) {
        throw new NotFoundException('Skill with the specified ID is not found');
      }

      // Update the project
      await this.prisma.skillsToProjects.upsert({
        where: {
          skillId_projectId: {
            skillId: addSkillToProjectDto.skillId,
            projectId: projectId,
          },
        },
        update: {
          projectId: projectId,
          skillId: addSkillToProjectDto.skillId,
          vacancies: addSkillToProjectDto.vacancies,
        },
        create: {
          projectId: projectId,
          skillId: addSkillToProjectDto.skillId,
          vacancies: addSkillToProjectDto.vacancies,
        },
      });

      return { message: 'Skills added/updated successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return error;
      } else {
        throw new InternalServerErrorException('Failed to add/update skills');
      }
    }
  }

  async removeSkill(projectId: string, skillId: string) {
    try {
      // Check if the skill exists
      const skill = await this.prisma.skillsToProjects.findUnique({
        where: {
          skillId_projectId: {
            projectId: projectId,
            skillId: skillId,
          },
        },
      });
      if (!skill) {
        throw new NotFoundException('Skill not found');
      }

      // Remove the skill
      await this.prisma.skillsToProjects.delete({
        where: {
          skillId_projectId: {
            projectId: projectId,
            skillId: skillId,
          },
        },
      });

      return { message: 'Skill removed successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return error;
      } else {
        throw new InternalServerErrorException('Failed to remove skill');
      }
    }
  }

  async fetchProjectParticipants(projectId: string) {
    try {
      // Check if project exists
      const project = await this.prisma.projects.findUnique({
        where: {
          id: projectId,
        },
      });
      if (!project) {
        throw new NotFoundException('Project not found.');
      }

      const participants = await this.prisma.applications.findMany({
        where: {
          AND: [{ projectId: projectId }, { status: 'ACCEPTED' }],
        },
        select: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              username: true,
            },
          },
        },
      });

      return participants;
    } catch (error) {
      if (error instanceof NotFoundException) {
        return error;
      } else {
        throw new InternalServerErrorException(
          'Failed to fetch participants list. Pleas try again.',
        );
      }
    }
  }

  async checkOwner(projectId: string, userId: string) {
    try {
      const project = await this.prisma.projects.findUnique({
        where: {
          id: projectId,
        },
        include: {
          organization: {
            include: {
              owner: true,
            },
          },
        },
      });

      if (userId === project.organization.owner.id) {
        return { isOwner: true };
      }

      return { isOwner: false };
    } catch (error) {
      throw new InternalServerErrorException('Failed to check owner');
    }
  }
}
