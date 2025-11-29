import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ClientStatus } from '@prisma/client';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  listByAgency(agencyId: string) {
    return this.prisma.client.findMany({
      where: { agencyId },
      include: { projects: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(user: any, data: any) {
    if (!user.agencyId) throw new BadRequestException('Missing agency');
    return this.prisma.client.create({ data: { ...data, agencyId: user.agencyId } });
  }

  async get(user: any, id: string) {
    const client = await this.prisma.client.findFirst({ where: { id, agencyId: user.agencyId }, include: { projects: true } });
    if (!client) throw new NotFoundException('Client not found');
    return client;
  }

  async update(user: any, id: string, data: any) {
    await this.get(user, id);
    return this.prisma.client.update({ where: { id }, data });
  }

  async remove(user: any, id: string) {
    await this.get(user, id);
    return this.prisma.client.update({ where: { id }, data: { status: ClientStatus.ARCHIVED } });
  }
}
