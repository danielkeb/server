import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CertificatesService {
  constructor(private prisma: PrismaService) {}

  findAll(userId: string) {
    try {
      const certificates = this.prisma.certificates.findMany({
        where: {
          userId,
        },
        include: {
          project: {
            include: {
              organization: true,
            },
          },
        },
      });

      return certificates;
    } catch (error) {
      throw new InternalServerErrorException('Failed to load certificates');
    }
  }

  findOne(id: string) {
    try {
      const certificate = this.prisma.certificates.findUnique({
        where: { id },
        include: {
          user: true,
          project: {
            include: {
              organization: true,
            },
          },
        },
      });

      if (certificate) {
        return certificate;
      } else {
        throw new NotFoundException('Certificate not found');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to locate certificate');
      }
    }
  }
}
