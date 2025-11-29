import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ReportStatus, UserRole } from '@prisma/client';

@Controller()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AGENCY_OWNER, UserRole.AGENCY_MANAGER)
  @Get('reports')
  list(@Req() req: any, @Query('projectId') projectId?: string, @Query('status') status?: ReportStatus) {
    return this.reportsService.list(req.user, projectId, status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AGENCY_OWNER, UserRole.AGENCY_MANAGER)
  @Post('reports')
  create(@Req() req: any, @Body() body: any) {
    return this.reportsService.create(req.user, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AGENCY_OWNER, UserRole.AGENCY_MANAGER)
  @Get('reports/:id')
  get(@Req() req: any, @Param('id') id: string) {
    return this.reportsService.get(req.user, id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AGENCY_OWNER, UserRole.AGENCY_MANAGER)
  @Patch('reports/:id')
  update(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    return this.reportsService.update(req.user, id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AGENCY_OWNER, UserRole.AGENCY_MANAGER)
  @Post('reports/:id/publish')
  publish(@Req() req: any, @Param('id') id: string) {
    return this.reportsService.publish(req.user, id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLIENT)
  @Get('client/overview')
  clientOverview(@Req() req: any) {
    return this.reportsService.clientOverview(req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLIENT)
  @Get('client/reports/:id')
  clientReport(@Req() req: any, @Param('id') id: string) {
    return this.reportsService.clientReport(req.user, id);
  }
}
