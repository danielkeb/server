import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { Role } from 'src/RBAC/role.enum';
import { Roles } from 'src/RBAC/roles.decorator';
import { Public } from 'src/auth/decorators/public.decorator';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationsService } from './organizations.service';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Roles(Role.Volunteer)
  @Post()
  create(
    @Req() req: Request,
    @Body() createOrganizationDto: CreateOrganizationDto,
  ) {
    const ownerId = req['user'].sub;
    return this.organizationsService.create(ownerId, createOrganizationDto);
  }

  @Public()
  @Get(':identifier')
  getOrg(@Param('identifier') identifier) {
    return this.organizationsService.getOrg(identifier);
  }

  @Patch(':id')
  updateById(@Param('id') id, @Body() updateOrgDto: UpdateOrganizationDto) {
    return this.organizationsService.updateById(id, updateOrgDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.organizationsService.findAll();
  }
}
