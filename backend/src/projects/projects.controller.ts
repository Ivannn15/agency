import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.AGENCY_OWNER, UserRole.AGENCY_MANAGER)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  list(@Req() req: any, @Query('clientId') clientId?: string) {
    return this.projectsService.list(req.user, clientId);
  }

  @Post()
  create(@Req() req: any, @Body() body: any) {
    return this.projectsService.create(req.user, body);
  }

  @Get(':id')
  get(@Req() req: any, @Param('id') id: string) {
    return this.projectsService.get(req.user, id);
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    return this.projectsService.update(req.user, id, body);
  }
}
