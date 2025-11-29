import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AgenciesService } from './agencies.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('agencies')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.AGENCY_OWNER, UserRole.AGENCY_MANAGER)
export class AgenciesController {
  constructor(private readonly agenciesService: AgenciesService) {}

  @Get('me')
  getMine(@Req() req: any) {
    return this.agenciesService.findByUser(req.user);
  }

  @Patch('me')
  update(@Req() req: any, @Body() body: any) {
    return this.agenciesService.update(req.user, body);
  }
}
