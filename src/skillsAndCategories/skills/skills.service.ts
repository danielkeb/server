import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Injectable()
export class SkillsService {
  constructor(private prisma: PrismaService) {}

  async create(createSkillDto: CreateSkillDto) {
    try {
      // Check for uniqueness of skill name
      const existingSkillName = await this.prisma.skills.findUnique({
        where: { name: createSkillDto.name },
      });

      if (existingSkillName) {
        throw new ConflictException();
      }

      // Check if the category exists
      const category = await this.prisma.skillCategories.findUnique({
        where: { id: createSkillDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException();
      }

      // Create the new skill
      return await this.prisma.skills.create({
        data: createSkillDto,
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(
          'There already exists a skill with the same name',
        );
      } else if (error instanceof NotFoundException) {
        throw new NotFoundException(
          'There is no category with the specified id',
        );
      } else {
        throw new InternalServerErrorException(
          'Failed to create skill. Please try again later.',
        );
      }
    }
  }

  async findAll() {
    try {
      return await this.prisma.skills.findMany({
        include: {
          category: true,
          _count: {
            select: {
              projects: true,
              users: true,
            },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to find all skills. Please try again later',
      );
    }
  }

  async search(query: string) {
    try {
      return await this.prisma.skills.findMany({
        where: {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
        include: {
          category: true,
          _count: {
            select: {
              projects: true,
              users: true,
            },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve search result. Please try again later',
      );
    }
  }

  async findOne(id: string) {
    try {
      const skill = await this.prisma.skills.findUnique({
        where: { id: id },
        include: {
          category: true,
          _count: {
            select: {
              projects: true,
              users: true,
            },
          },
        },
      });

      if (!skill) {
        throw new NotFoundException();
      }

      return skill;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('There is no skill with the specified id');
      } else {
        throw new InternalServerErrorException(
          'Failed to find skill. Please try again later.',
        );
      }
    }
  }

  async update(id: string, updateSkillDto: UpdateSkillDto) {
    try {
      // Check if the skill to be updated exists
      const existingSkill = await this.prisma.skills.findUnique({
        where: { id },
      });

      if (!existingSkill) {
        throw new NotFoundException();
      }

      // Check the new skill name for conflict - if it exists
      if (updateSkillDto.name) {
        const existingSkillName = await this.prisma.skills.findUnique({
          where: { name: updateSkillDto.name },
        });

        if (existingSkillName) {
          throw new ConflictException();
        }
      }

      // Check if category exists
      if (updateSkillDto.categoryId) {
        const existingCategory = await this.prisma.skillCategories.findUnique({
          where: { id: updateSkillDto.categoryId },
        });

        if (!existingCategory) {
          throw new NotFoundException();
        }
      }

      // Update the skill
      return await this.prisma.skills.update({
        where: { id },
        data: updateSkillDto,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(
          'The skill or the category cannot be found',
        );
      } else if (error instanceof ConflictException) {
        throw new ConflictException(
          'A skill with the same name already exists',
        );
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async remove(id: string) {
    try {
      // Check if the skill to be deleted exists
      const skill = await this.prisma.skills.findUnique({
        where: { id },
      });

      if (!skill) {
        throw new NotFoundException();
      }

      // Delete the skill
      await this.prisma.skills.delete({
        where: { id: id },
      });

      return { message: 'Skill deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('A skill with specified id was not found');
      } else {
        throw new InternalServerErrorException(
          'Failed to delete skill skill. Please try again later.',
        );
      }
    }
  }
}
