import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async create(ownerId: string, createOrganizationDto: CreateOrganizationDto) {
    try {
      // Check if the name/contactEmail/contactPhone/websiteURL is unique
      const checkConflict = await this.prisma.organizations.findFirst({
        where: {
          OR: [
            { name: createOrganizationDto.name },
            { contactEmail: createOrganizationDto.contactEmail },
            { contactPhone: createOrganizationDto.contactPhone },
            { websiteUrl: createOrganizationDto.websiteUrl },
          ],
        },
      });
      if (checkConflict) {
        throw new ConflictException(
          'An organization with the same name/websiteURL/email/phone already exists',
        );
      }

      // Check if the location with the specified ID exists
      const location = await this.prisma.locations.findUnique({
        where: { id: createOrganizationDto.locationId },
      });
      if (!location) {
        throw new NotFoundException(
          'A location with the specified ID was not found',
        );
      }

      // Create the organization
      const newOrganization = await this.prisma.organizations.create({
        data: {
          verified: false,
          ...createOrganizationDto,
        },
        include: {
          location: true,
          logo: true,
          owner: true,
          permit: true,
          projects: true,
        },
      });

      // Connect the organization with the user
      await this.prisma.users.update({
        where: {
          id: ownerId,
        },
        data: {
          organizationId: newOrganization.id,
        },
      });

      return newOrganization;
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Failed to create organization. Please try again later.',
        );
      }
    }
  }

  async getOrg(identifier: string) {
    try {
      const org = await this.prisma.organizations.findFirst({
        where: {
          OR: [{ id: identifier }, { name: identifier }, { isActive: true }],
        },
        include: {
          location: true,
          logo: true,
          owner: true,
          permit: true,
          projects: true,
          _count: {
            select: {
              projects: {
                where: {
                  status: 'DONE',
                },
              },
            },
          },
        },
      });

      if (!org) {
        throw new NotFoundException(
          'Organization with the specified id/name not found',
        );
      }

      return org;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Failed to get organization. Please try again.',
        );
      }
    }
  }

  async updateById(id: string, updateOrgDto: UpdateOrganizationDto) {
    try {
      // Check if organization with the specified ID exists
      const org = await this.prisma.organizations.findUnique({
        where: { id },
      });
      if (!org) {
        throw new NotFoundException(
          'Organization with the specified ID was not found',
        );
      }

      // Update the organization
      const updatedOrg = await this.prisma.organizations.update({
        where: { id },
        data: updateOrgDto,
        include: {
          location: true,
          logo: true,
          owner: true,
          permit: true,
          projects: true,
        },
      });

      return updatedOrg;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Failed to update organization. Please try again.',
        );
      }
    }
  }

  async findAll() {
    try {
      const organizations = await this.prisma.organizations.findMany({
        orderBy: [{ verified: 'asc' }, { name: 'asc' }],
        include: { location: true },
      });

      return organizations;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to find all organizations. Please try again later',
      );
    }
  }
}
