import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from 'src/RBAC/role.enum';
import { Roles } from 'src/RBAC/roles.decorator';
import { Public } from 'src/auth/decorators/public.decorator';
import {
  ApiCreateSkillCategoryEndpoint,
  ApiFindAllSkillCategoriesEndpoint,
  ApiFindSkillCategoryByIdEndpoint,
  ApiFindSkillCategoryByNameEndpoint,
  ApiRemoveSkillCategoryEndpoint,
  ApiUpdateSkillCategoryEndpoint,
} from './docs/skill-categories-controllers.doc';
import { CreateSkillCategoryDto } from './dto/create-skill-category.dto';
import { UpdateSkillCategoryDto } from './dto/update-skill-category.dto';
import { SkillCategoriesService } from './skill-categories.service';

@ApiTags('Skill Categories')
@Controller('skill-categories')
export class SkillCategoriesController {
  constructor(
    private readonly skillCategoriesService: SkillCategoriesService,
  ) {}

  @Roles(Role.Admin)
  @Post()
  @ApiCreateSkillCategoryEndpoint()
  create(@Body() createSkillCategoryDto: CreateSkillCategoryDto) {
    return this.skillCategoriesService.create(createSkillCategoryDto);
  }

  @Public()
  @ApiFindAllSkillCategoriesEndpoint()
  @Get()
  findAll() {
    return this.skillCategoriesService.findAll();
  }

  @Public()
  @ApiFindSkillCategoryByIdEndpoint()
  @Get('id/:id')
  findOneById(@Param('id') id: string) {
    return this.skillCategoriesService.findOneById(id);
  }

  @Public()
  @ApiFindSkillCategoryByNameEndpoint()
  @Get('name/:name')
  findOneByName(@Param('name') name: string) {
    return this.skillCategoriesService.findOneByName(name);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  @ApiUpdateSkillCategoryEndpoint()
  update(
    @Param('id') id: string,
    @Body() updateSkillCategoryDto: UpdateSkillCategoryDto,
  ) {
    return this.skillCategoriesService.update(id, updateSkillCategoryDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  @ApiRemoveSkillCategoryEndpoint()
  remove(@Param('id') id: string) {
    return this.skillCategoriesService.remove(id);
  }
}
