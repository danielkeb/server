import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async addReviewToProject(
    createReviewDto: CreateReviewDto,
    userId: string,
    projectId: string,
  ) {
    try {
      // Check if user exists
      const user = await this.prisma.users.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Check if project exists and is finished project
      const project = await this.prisma.projects.findFirst({
        where: {
          AND: [{ id: projectId }, { status: 'DONE' }],
        },
      });
      if (!project) {
        throw new NotFoundException('Project not found');
      }

      // Check if user already gave his review
      const reviewExists = await this.prisma.reviews.findFirst({
        where: {
          AND: [{ userId: userId }, { projectId: projectId }],
        },
      });
      if (reviewExists) {
        throw new ConflictException(
          'The user has already reviewed this project',
        );
      }

      // Create the review
      const review = await this.prisma.reviews.create({
        data: {
          userId: userId,
          projectId: projectId,
          comment: createReviewDto.comment,
          rating: createReviewDto.rating,
        },
      });

      return {
        message: 'Review added successful',
        review: review,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        return error;
      } else {
        throw new InternalServerErrorException(
          'Failed to add review. Please try agin later.',
        );
      }
    }
  }

  async getReviewsByProjectId(projectId: string) {
    try {
      // Check if project exists
      const project = await this.prisma.projects.findUnique({
        where: { id: projectId },
      });
      if (!project) {
        throw new NotFoundException('Project not found');
      }

      // Get reviews
      const reviews = await this.prisma.reviews.findMany({
        where: { projectId: projectId },
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

      return reviews;
    } catch (error) {
      if (error instanceof NotFoundException) {
        return error;
      } else {
        throw new InternalServerErrorException(
          'Failed to get reviews. Please try again later.',
        );
      }
    }
  }

  async checkReviewed(userId: string, projectId: string) {
    try {
      const review = await this.prisma.reviews.findFirst({
        where: {
          AND: [{ userId: userId }, { projectId: projectId }],
        },
      });

      return {
        reviewed: review ? true : false,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to check review. Please try again.',
      );
    }
  }
}
