import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSkillCategoryDto } from './dto/create-skill-category.dto';
import { UpdateSkillCategoryDto } from './dto/update-skill-category.dto';

@Injectable()
export class SkillCategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createSkillCategoryDto: CreateSkillCategoryDto) {
    try {
      // Check if the category already exists
      const category = await this.prisma.skillCategories.findUnique({
        where: { name: createSkillCategoryDto.name },
      });

      if (category) {
        throw new ConflictException();
      }

      // Create the new category
      return this.prisma.skillCategories.create({
        data: createSkillCategoryDto,
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(
          'A category with the same name already exists',
        );
      } else {
        throw new InternalServerErrorException(
          'Failed to create skill category. Please try again later.',
        );
      }
    }
  }

  async findAll() {
    try {
      return await this.prisma.skillCategories.findMany({
        include: {
          _count: {
            select: { skills: true },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to find all skill categories. Please try again later',
      );
    }
  }

  async findOneById(id: string) {
    try {
      const category = await this.prisma.skillCategories.findUnique({
        where: { id: id },
        include: {
          _count: {
            select: { skills: true },
          },
        },
      });

      if (!category) {
        throw new NotFoundException();
      }

      return category;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(
          'A category with specified id was not found',
        );
      } else {
        throw new InternalServerErrorException(
          'Failed to find skill category. Please try again later.',
        );
      }
    }
  }

  async findOneByName(name: string) {
    try {
      const category = await this.prisma.skillCategories.findUnique({
        where: { name: name },
        include: {
          _count: {
            select: { skills: true },
          },
        },
      });

      if (!category) {
        throw new NotFoundException();
      }

      return category;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(
          'A category with specified name was not found',
        );
      } else {
        throw new InternalServerErrorException(
          'Failed to find skill category. Please try again later.',
        );
      }
    }
  }

  async update(id: string, updateSkillCategoryDto: UpdateSkillCategoryDto) {
    try {
      // check if category exists
      const category = await this.prisma.skillCategories.findUnique({
        where: { id: id },
      });

      if (!category) {
        throw new NotFoundException();
      }

      // Check the new category for duplicates
      const duplicateCategory = await this.prisma.skillCategories.findUnique({
        where: { name: updateSkillCategoryDto.name, AND: { id: { not: id } } },
      });

      if (duplicateCategory) {
        throw new ConflictException();
      }

      return await this.prisma.skillCategories.update({
        where: { id: id },
        data: updateSkillCategoryDto,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(
          'A category with specified id was not found',
        );
      } else if (error instanceof ConflictException) {
        throw new ConflictException(
          'A category with the same name already exists',
        );
      } else {
        throw new InternalServerErrorException(
          'Failed to update skill category. Please try again later.',
        );
      }
    }
  }

  async remove(id: string) {
    try {
      // Check if the category to be deleted exists
      const category = await this.prisma.skillCategories.findUnique({
        where: { id },
      });

      if (!category) {
        throw new NotFoundException();
      }

      // Delete the category
      await this.prisma.skillCategories.delete({
        where: { id: id },
      });

      return { message: 'Category deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(
          'A category with specified id was not found',
        );
      } else {
        throw new InternalServerErrorException(
          'Failed to delete skill category. Please try again later.',
        );
      }
    }
  }
}
