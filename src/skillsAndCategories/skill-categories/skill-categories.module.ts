import { Module } from '@nestjs/common';
import { SkillCategoriesService } from './skill-categories.service';
import { SkillCategoriesController } from './skill-categories.controller';

@Module({
  controllers: [SkillCategoriesController],
  providers: [SkillCategoriesService],
})
export class SkillCategoriesModule {}
