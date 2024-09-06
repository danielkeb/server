import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getSummary() {
    try {
      // Total number of users
      const totalUserCount = await this.prisma.users.count();

      // Number of users that are active in the last 30 days
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 30);
      const monthlyActiveUserCount = await this.prisma.users.count({
        where: {
          lastLoggedInAt: {
            gte: cutoffDate,
          },
        },
      });

      // Deactivated accounts
      const deactivatedAccountsCount = await this.prisma.users.count({
        where: {
          isActive: false,
        },
      });

      // Total number of projects
      const totalProjectCount = await this.prisma.projects.count();

      // Total number of organizations
      const totalOrganizationsCount = await this.prisma.organizations.count();

      const response = {
        users: {
          total: totalUserCount,
          active: monthlyActiveUserCount,
          deactivatedAccounts: deactivatedAccountsCount,
        },
        projects: {
          total: totalProjectCount,
        },
        organizations: {
          total: totalOrganizationsCount,
        },
      };

      return response;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to get summary. Please try again later.',
      );
    }
  }

  async getAgeAndGenderCount() {
    try {
      const genderCount = await this.prisma.users.groupBy({
        by: ['gender'],
        _count: {
          _all: true,
        },
      });

      const _18to34 = await this.prisma.users.count({
        where: {
          age: {
            gte: 18,
            lte: 34,
          },
        },
      });
      const _35to54 = await this.prisma.users.count({
        where: {
          age: {
            gte: 35,
            lte: 54,
          },
        },
      });
      const _55to74 = await this.prisma.users.count({
        where: {
          age: {
            gte: 55,
            lte: 74,
          },
        },
      });
      const _75AndMore = await this.prisma.users.count({
        where: {
          age: {
            gte: 75,
          },
        },
      });
      const ageNotSpecified = await this.prisma.users.count({
        where: {
          age: null,
        },
      });

      const gender = [];
      for (const item of genderCount) {
        const bb = {
          name: item.gender || 'N/A',
          value: item._count._all,
        };

        gender.push(bb);
      }

      return {
        gender: gender,
        age: [
          { name: '18-34', value: _18to34 },
          { name: '35-54', value: _35to54 },
          { name: '55-74', value: _55to74 },
          { name: '75 And More', value: _75AndMore },
          { name: 'Not Specified', value: ageNotSpecified },
        ],
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to load data.');
    }
  }

  async projectStat() {
    try {
      const res = [];

      const shortTerm1 = await this.countProjects('NOT_STARTED', 'SHORT_TERM');
      const longTerm1 = await this.countProjects('NOT_STARTED', 'LONG_TERM');
      const inPerson1 = await this.countProjects(
        'NOT_STARTED',
        null,
        'IN_PERSON',
      );
      const remote1 = await this.countProjects('NOT_STARTED', null, 'REMOTE');

      res.push({
        name: 'Not Started',
        shortTerm: shortTerm1,
        longTerm: longTerm1,
        inPerson: inPerson1,
        remote: remote1,
      });

      const shortTerm2 = await this.countProjects('IN_PROGRESS', 'SHORT_TERM');
      const longTerm2 = await this.countProjects('IN_PROGRESS', 'LONG_TERM');
      const inPerson2 = await this.countProjects(
        'IN_PROGRESS',
        null,
        'IN_PERSON',
      );
      const remote2 = await this.countProjects('IN_PROGRESS', null, 'REMOTE');

      res.push({
        name: 'In Progress',
        shortTerm: shortTerm2,
        longTerm: longTerm2,
        inPerson: inPerson2,
        remote: remote2,
      });

      const shortTerm3 = await this.countProjects('DONE', 'SHORT_TERM');
      const longTerm3 = await this.countProjects('DONE', 'LONG_TERM');
      const inPerson3 = await this.countProjects('DONE', null, 'IN_PERSON');
      const remote3 = await this.countProjects('DONE', null, 'REMOTE');

      res.push({
        name: 'Done',
        shortTerm: shortTerm3,
        longTerm: longTerm3,
        inPerson: inPerson3,
        remote: remote3,
      });

      return res;
    } catch (error) {
      throw new InternalServerErrorException('Failed to load data.');
    }
  }

  async verifiedAndNotVerified() {
    try {
      const verifiedUser = await this.prisma.users.findMany({
        where: {
          emailVerified: true,
        },
      });
      const notVerifiedUser = await this.prisma.users.findMany({
        where: {
          emailVerified: false,
        },
      });
      const verifiedOrg = await this.prisma.organizations.findMany({
        where: {
          verified: true,
        },
      });
      const notVerifiedOrg = await this.prisma.organizations.findMany({
        where: {
          verified: false,
        },
      });

      return [
        {
          name: 'Users',
          verified: verifiedUser.length,
          unverified: notVerifiedUser.length,
        },
        {
          name: 'Org',
          verified: verifiedOrg.length,
          unverified: notVerifiedOrg.length,
        },
      ];
    } catch (error) {}
  }

  async reportStats() {
    try {
      const fakeActive = await this.countReports('FAKE', true);
      const fakeResolved = await this.countReports('FAKE', false);

      const scamActive = await this.countReports('SCAM', true);
      const scamResolved = await this.countReports('SCAM', false);

      const contentActive = await this.countReports(
        'INAPPROPRIATE_CONTENT',
        true,
      );
      const contentResolved = await this.countReports(
        'INAPPROPRIATE_CONTENT',
        false,
      );

      const spamActive = await this.countReports('SPAM', true);
      const spamResolved = await this.countReports('SPAM', false);

      const impersonationActive = await this.countReports(
        'IMPERSONATION',
        true,
      );
      const impersonationResolved = await this.countReports(
        'IMPERSONATION',
        false,
      );

      const privacyActive = await this.countReports('PRIVACY_VIOLATION', true);
      const privacyResolved = await this.countReports(
        'PRIVACY_VIOLATION',
        false,
      );

      const otherActive = await this.countReports('OTHER', true);
      const otherResolved = await this.countReports('OTHER', false);

      return {
        fake: {
          active: fakeActive,
          resolved: fakeResolved,
        },
        scam: {
          active: scamActive,
          resolved: scamResolved,
        },
        inappropriate_content: {
          active: contentActive,
          resolved: contentResolved,
        },
        spam: {
          active: spamActive,
          resolved: spamResolved,
        },
        impersonation: {
          active: impersonationActive,
          resolved: impersonationResolved,
        },
        privacy: {
          active: privacyActive,
          resolved: privacyResolved,
        },
        other: {
          active: otherActive,
          resolved: otherResolved,
        },
      };
    } catch (error) {}
  }

  async getPopularSkills() {
    const skills = await this.prisma.skills.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            users: true,
            projects: true,
          },
        },
      },
    });

    // Sort skills based on usage (sum of users + projects)
    const sortedSkills = skills.sort((a, b) => {
      const aUsage = (a._count.users || 0) + (a._count.projects || 0);
      const bUsage = (b._count.users || 0) + (b._count.projects || 0);
      return bUsage - aUsage; // Sort in descending order
    });

    const filteredSkills = sortedSkills.slice(0, 10);

    return filteredSkills;
  }

  async countReports(reason, isActive) {
    const whereConditions = [];
    whereConditions.push({ reason: reason });

    if (isActive) {
      whereConditions.push({ status: 'ACTIVE' });
    } else {
      whereConditions.push({ status: 'RESOLVED' });
    }

    const count = await this.prisma.reports.count({
      where: {
        AND: whereConditions,
      },
    });

    return count;
  }

  async countProjects(status, timeCommitment = null, locationId = null) {
    const whereConditions = [];
    whereConditions.push({ status: status });

    if (timeCommitment) {
      whereConditions.push({ timeCommitment: timeCommitment });
    }

    if (locationId !== null && locationId === 'IN_PERSON') {
      whereConditions.push({ locationId: { not: null } });
    } else if (locationId === 'REMOTE') {
      whereConditions.push({ locationId: null });
    }

    const count = await this.prisma.projects.count({
      where: {
        AND: whereConditions,
      },
    });

    return count;
  }

  async getProjectProgress(projectId: string) {
    try {
      // Check if project exists
      const project = await this.prisma.projects.findUnique({
        where: { id: projectId },
      });
      if (!project) {
        throw new NotFoundException('Project not found');
      }

      // Count open tasks
      const openTasks = await this.prisma.tasks.count({
        where: {
          projectId: projectId,
          status: 'OPEN',
        },
      });

      // Count completed tasks
      const completedTasks = await this.prisma.tasks.count({
        where: {
          projectId: projectId,
          status: 'COMPLETED',
        },
      });

      // Calculate progress
      const progress = (completedTasks / (openTasks + completedTasks)) * 100;

      return {
        progress: progress,
        openTasks: openTasks,
        completedTasks: completedTasks,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to locate project');
      }
    }
  }
}
