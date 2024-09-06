import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Role } from 'src/RBAC/role.enum';
import { Roles } from 'src/RBAC/roles.decorator';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Roles(Role.Volunteer)
  @Post()
  create(@Req() req, @Body() createReportDto: CreateReportDto) {
    const reporterId = req.user.sub;
    return this.reportsService.create(reporterId, createReportDto);
  }

  @Get()
  findAll() {
    return this.reportsService.findAll();
  }

  @Roles(Role.Admin)
  @Post(':id/resolve')
  resolveReport(@Param('id') id: string) {
    this.reportsService.resolveAReport(id);
  }
}
