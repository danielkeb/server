import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  async create(name: string, code: string) {
    try {
      // Check if a location with the given name already exists
      const existingLocation = await this.prisma.locations.findFirst({
        where: {
          OR: [{ name: name, code: code }],
        },
      });

      if (existingLocation) {
        throw new ConflictException('Location already exists');
      }

      const location = await this.prisma.locations.create({
        data: { name: name, code: code },
      });

      return location;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Failed to create location. Please try again later.',
        );
      }
    }
  }

  async findAll() {
    try {
      return await this.prisma.locations.findMany({
        orderBy: {
          name: 'asc',
        },
        include: {
          _count: {
            select: {
              users: true,
              projects: true,
              organizations: true,
            },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to find all locations. Please try again later',
      );
    }
  }

  async findOneById(id: string) {
    try {
      const location = await this.prisma.locations.findUnique({
        where: { id },
      });

      if (location) return location;
      else
        throw new NotFoundException(
          'Location with the specified ID cannot be found',
        );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to locate location');
      }
    }
  }

  async findOneByName(name: string) {
    try {
      const location = await this.prisma.locations.findUnique({
        where: { name },
      });

      if (location) return location;
      else
        throw new NotFoundException(
          'Location with the specified name cannot be found',
        );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to locate location');
      }
    }
  }

  async findOneByShortCode(code: string) {
    try {
      const location = await this.prisma.locations.findUnique({
        where: { code },
      });

      if (location) return location;
      else
        throw new NotFoundException(
          'Location with the specified short code cannot be found',
        );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to locate location');
      }
    }
  }

  async update(id: string, updateLocationDto: UpdateLocationDto) {
    try {
      const existingLocation = await this.prisma.locations.findUnique({
        where: { id },
      });

      if (!existingLocation) {
        throw new NotFoundException(
          'Location with the specified ID cannot be found',
        );
      }

      return await this.prisma.locations.update({
        where: { id },
        data: updateLocationDto,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Failed to update location. Please try again later.',
        );
      }
    }
  }

  async remove(id: string) {
    try {
      const location = await this.prisma.locations.delete({
        where: { id },
      });

      if (location) return { message: 'Location successfully deleted' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete location. Please try again later.',
      );
    }
  }
}
