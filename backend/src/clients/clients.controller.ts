import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('clients')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.AGENCY_OWNER, UserRole.AGENCY_MANAGER)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  list(@Req() req: any) {
    return this.clientsService.listByAgency(req.user.agencyId);
  }

  @Post()
  create(@Req() req: any, @Body() body: any) {
    return this.clientsService.create(req.user, body);
  }

  @Get(':id')
  get(@Req() req: any, @Param('id') id: string) {
    return this.clientsService.get(req.user, id);
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    return this.clientsService.update(req.user, id, body);
  }

  @Delete(':id')
  delete(@Req() req: any, @Param('id') id: string) {
    return this.clientsService.remove(req.user, id);
  }
}
