import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ApplicationsService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async checkApplication(userId: string, projectId: string) {
    try {
      const application = await this.prisma.applications.findFirst({
        where: {
          AND: [{ userId: userId }, { projectId: projectId }],
        },
      });

      return {
        applied: application ? true : false,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to check application. Please try again.',
      );
    }
  }

  async getMyApplications(userId: string) {
    try {
      const pendingApplications = await this.prisma.applications.findMany({
        where: {
          AND: [{ userId: userId }, { status: 'PENDING' }],
        },
        include: {
          project: true,
        },
      });

      const acceptedApplications = await this.prisma.applications.findMany({
        where: {
          AND: [{ userId: userId }, { status: 'ACCEPTED' }],
        },
        include: {
          project: true,
        },
      });

      const rejectedApplications = await this.prisma.applications.findMany({
        where: {
          AND: [{ userId: userId }, { status: 'REJECTED' }],
        },
        include: {
          project: true,
        },
      });

      return {
        pending: pendingApplications,
        accepted: acceptedApplications,
        rejected: rejectedApplications,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve applications. Please try again.',
      );
    }
  }

  async getApplicationsByProjectId(projectId: string) {
    try {
      const pendingApplications = await this.prisma.applications.findMany({
        where: {
          AND: [{ projectId: projectId }, { status: 'PENDING' }],
        },
        include: {
          user: {
            include: {
              location: true,
            },
          },
        },
      });

      const acceptedApplications = await this.prisma.applications.findMany({
        where: {
          AND: [{ projectId: projectId }, { status: 'ACCEPTED' }],
        },
        include: {
          user: {
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
        },
      });

      const rejectedApplications = await this.prisma.applications.findMany({
        where: {
          AND: [{ projectId: projectId }, { status: 'REJECTED' }],
        },
        include: {
          user: {
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
        },
      });

      return {
        pending: pendingApplications,
        accepted: acceptedApplications,
        rejected: rejectedApplications,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve applications. Please try again.',
      );
    }
  }

  async acceptApplication(applicationId: string) {
    try {
      const updateApplication = await this.prisma.applications.update({
        where: {
          id: applicationId,
        },
        data: {
          status: 'ACCEPTED',
        },
        include: {
          project: {
            include: {
              organization: true,
            },
          },
        },
      });

      // Send email if the user has enabled notification
      const user = await this.prisma.users.findUnique({
        where: {
          id: updateApplication.userId,
        },
      });

      let notificationEnabled = false;
      user.notificationPreference.map((preference: any) => {
        if (
          preference.option === 'application_status_update' &&
          preference.value
        ) {
          notificationEnabled = true;
        }
      });

      if (notificationEnabled) {
        const fullName = `${user.firstName} ${user.lastName}`;
        const url = `http://localhost:3000/projects/${updateApplication.projectId}`;
        const startDate = updateApplication.project.startDate.toDateString();

        return this.emailService.sendApplicationAcceptedEmail(
          user.email,
          fullName,
          updateApplication.project.title,
          updateApplication.project.organization.name,
          startDate,
          url,
        );
      }

      return {
        message: 'Failed to accept application. Please try again.',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to accept application. Please try again.',
      );
    }
  }

  async rejectApplication(applicationId: string) {
    try {
      const updateApplication = await this.prisma.applications.update({
        where: {
          id: applicationId,
        },
        data: {
          status: 'REJECTED',
        },
        include: {
          project: {
            include: {
              organization: true,
            },
          },
        },
      });

      // Send email if the user has enabled notification
      const user = await this.prisma.users.findUnique({
        where: {
          id: updateApplication.userId,
        },
      });

      let notificationEnabled = false;
      user.notificationPreference.map((preference: any) => {
        if (
          preference.option === 'application_status_update' &&
          preference.value
        ) {
          notificationEnabled = true;
        }
      });

      if (notificationEnabled) {
        const fullName = `${user.firstName} ${user.lastName}`;

        return this.emailService.sendApplicationRejectedEmail(
          user.email,
          fullName,
          updateApplication.project.title,
          updateApplication.project.organization.name,
        );
      }

      return {
        message: 'Failed to reject application. Please try again.',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to accept application. Please try again.',
      );
    }
  }
}
