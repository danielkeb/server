import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async create(reporterId: string, createReportDto: CreateReportDto) {
    try {
      // Check if the reporter exists
      const user = await this.prisma.users.findUnique({
        where: { id: reporterId },
      });
      if (!user) {
        throw new NotFoundException('Reporter not found');
      }

      // Check if the content to be reported exists
      let exists;

      switch (createReportDto.contentType) {
        case 'USER':
          exists = await this.prisma.users.findUnique({
            where: { id: createReportDto.contentId },
          });
          break;
        case 'ORGANIZATION':
          exists = await this.prisma.organizations.findUnique({
            where: { id: createReportDto.contentId },
          });
          break;
        case 'PROJECT':
          exists = await this.prisma.projects.findUnique({
            where: { id: createReportDto.contentId },
          });
          break;
        case 'REVIEW':
          exists = await this.prisma.reviews.findUnique({
            where: { id: createReportDto.contentId },
          });
          break;
      }
      if (!exists) {
        throw new NotFoundException('Content not found');
      }

      // Create the report
      const report = await this.prisma.reports.create({
        data: {
          ...createReportDto,
          status: 'ACTIVE',
          reporterId: reporterId,
        },
      });

      return report;
    } catch (error) {
      if (error instanceof NotFoundException) {
        return error;
      } else {
        throw new InternalServerErrorException(
          'Failed to create report. Please try again later.',
        );
      }
    }
  }

  async findAll() {
    try {
      return await this.prisma.reports.findMany({
        include: {
          reporter: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: [{ status: 'asc' }, { createdAt: 'asc' }],
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to find all reports. Please try again later',
      );
    }
  }

  async resolveAReport(id: string) {
    try {
      // Check if the report exists
      const report = await this.prisma.reports.findUnique({
        where: { id },
      });
      if (!report) {
        throw new NotFoundException('Report not found');
      }

      // Resolve Report
      await this.prisma.reports.update({
        where: { id },
        data: {
          status: 'RESOLVED',
        },
      });

      return {
        message: 'Resolved successful',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to resolve report');
      }
    }
  }
}
