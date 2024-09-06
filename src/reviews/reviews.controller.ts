import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Role } from 'src/RBAC/role.enum';
import { Roles } from 'src/RBAC/roles.decorator';
import { Public } from 'src/auth/decorators/public.decorator';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Roles(Role.Volunteer)
  @Post(':projectId')
  addReviewToProject(
    @Req() req,
    @Param('projectId') projectId: string,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    const userId = req.user.sub;
    return this.reviewsService.addReviewToProject(
      createReviewDto,
      userId,
      projectId,
    );
  }

  @Public()
  @Get(':projectId')
  getAllReviewByProjectId(@Param('projectId') projectId: string) {
    return this.reviewsService.getReviewsByProjectId(projectId);
  }

  @Roles(Role.Volunteer)
  @Get('check/:projectId')
  checkReviewed(@Param('projectId') projectId: string, @Req() req) {
    const userId = req.user.sub;
    return this.reviewsService.checkReviewed(userId, projectId);
  }
}
