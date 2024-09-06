import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

// Weights for recommendation score
const SKILLS_WEIGHT = 30;
const LOCATION_WEIGHT = 15;
const TIME_WEIGHT = 15;
const RECENT_PROJECT_THRESHOLD = 10; // in days
const RECENT_PROJECT_WEIGHT = 10;
const VERIFIED_WEIGHT = 20;
const MAX_RECOMMENDATION_COUNT = 10;

@Injectable()
export class RecommendationsService {
  constructor(private prisma: PrismaService) {}

  async recommendProject(projectId: string) {
    try {
      // Check if user exists
      const user = await this.prisma.users.findUnique({
        where: { id: projectId },
        include: {
          skills: true,
        },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Fetch projects
      const projects = await this.prisma.projects.findMany({
        where: {
          AND: [{ isActive: true }, { status: { not: 'DONE' } }],
        },
        include: {
          skillsRequired: {
            include: {
              skill: true,
            },
          },
          location: true,
          organization: true,
        },
      });

      // Calculate recommendation score
      const recommendations = projects.map((project) => {
        let score = 0;

        // Skill Matching
        const userSkills = user.skills.map((skill) => skill.id);
        const projectSkills = project.skillsRequired.map(
          (skill) => skill.skillId,
        );
        const matchingSkills = userSkills.filter((skill) =>
          projectSkills.includes(skill),
        );
        score += matchingSkills.length * SKILLS_WEIGHT;

        // Location Preference
        if (
          (user.locationPreference === 'IN_PERSON' && project.locationId) ||
          (user.locationPreference === 'REMOTE' && !project.locationId)
        ) {
          score += LOCATION_WEIGHT;
        }

        // Time Preference
        if (user.timePreference === project.timeCommitment) {
          score += TIME_WEIGHT;
        }

        // Recent Project
        // Check if project is recently created
        const recentlyCreatedProject =
          project.createdAt >
          new Date(Date.now() - RECENT_PROJECT_THRESHOLD * 24 * 60 * 60 * 1000);
        // Check if the project starts soon
        const projectStartsSoon =
          project.startDate >
          new Date(Date.now() + RECENT_PROJECT_THRESHOLD * 24 * 60 * 60 * 1000);
        if (recentlyCreatedProject || projectStartsSoon) {
          score += RECENT_PROJECT_WEIGHT;
        }

        // Is the organization that created the project verified
        if (project.organization.verified) {
          score += VERIFIED_WEIGHT;
        }

        return { project, score };
      });

      const filteredRecommendations = recommendations.filter(
        (recommendation) => recommendation.score > 0,
      );
      filteredRecommendations.sort((a, b) => b.score - a.score);

      return filteredRecommendations.slice(0, MAX_RECOMMENDATION_COUNT);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return error;
      } else {
        throw new InternalServerErrorException(
          'Failed to fetch recommendations. Please try again later.',
        );
      }
    }
  }
}
