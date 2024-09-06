import { Controller, Get, Req } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';

@Controller('recommendations')
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}

  @Get()
  async getRecommendations(@Req() req) {
    const userId = req.user.sub;
    return this.recommendationsService.recommendProject(userId);
  }
}
