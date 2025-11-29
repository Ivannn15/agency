import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class AgenciesService {
  constructor(private prisma: PrismaService) {}

  async findByUser(user: any) {
    if (!user.agencyId) throw new NotFoundException('Agency not found');
    return this.prisma.agency.findUnique({ where: { id: user.agencyId } });
  }

  async update(user: any, data: Partial<{ name: string; logoUrl: string; timezone: string; defaultCurrency: string }>) {
    if (!user.agencyId) throw new NotFoundException('Agency not found');
    return this.prisma.agency.update({ where: { id: user.agencyId }, data });
  }
}
