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
  ApiCreateLocationEndpoint,
  ApiDeleteLocationEndpoint,
  ApiFindOneByIdEndpoint,
  ApiFindOneByNameEndpoint,
  ApiFindOneByShortCodeEndpoint,
  ApiGetLocationEndpoint,
  ApiUpdateLocationEndpoint,
} from './docs/locations-controllers.docs';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationsService } from './locations.service';

@Controller('locations')
@ApiTags('Locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  @Roles(Role.Admin)
  @ApiCreateLocationEndpoint()
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationsService.create(
      createLocationDto.name,
      createLocationDto.code,
    );
  }

  @Public()
  @Get()
  @ApiGetLocationEndpoint()
  findAll() {
    return this.locationsService.findAll();
  }

  @Public()
  @Get('id/:id')
  @ApiFindOneByIdEndpoint()
  findOneById(@Param('id') id: string) {
    return this.locationsService.findOneById(id);
  }

  @Public()
  @Get('name/:name')
  @ApiFindOneByNameEndpoint()
  findOneByName(@Param('name') name: string) {
    return this.locationsService.findOneByName(name);
  }

  @Public()
  @Get('code/:code')
  @ApiFindOneByShortCodeEndpoint()
  findOneByShortCode(@Param('code') code: string) {
    return this.locationsService.findOneByShortCode(code);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  @ApiUpdateLocationEndpoint()
  update(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return this.locationsService.update(id, updateLocationDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  @ApiDeleteLocationEndpoint()
  remove(@Param('id') id: string) {
    return this.locationsService.remove(id);
  }
}
