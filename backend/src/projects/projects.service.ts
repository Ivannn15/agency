import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  list(user: any, clientId?: string) {
    return this.prisma.project.findMany({
      where: { agencyId: user.agencyId, clientId: clientId || undefined },
      include: { client: true, reports: { take: 3, orderBy: { createdAt: 'desc' } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async ensureClientBelongs(user: any, clientId: string) {
    const client = await this.prisma.client.findFirst({ where: { id: clientId, agencyId: user.agencyId } });
    if (!client) throw new BadRequestException('Client not in your agency');
  }

  async create(user: any, data: any) {
    await this.ensureClientBelongs(user, data.clientId);
    return this.prisma.project.create({ data: { ...data, agencyId: user.agencyId } });
  }

  async get(user: any, id: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, agencyId: user.agencyId },
      include: { client: true, reports: { orderBy: { createdAt: 'desc' }, take: 5 } },
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(user: any, id: string, data: any) {
    await this.get(user, id);
    return this.prisma.project.update({ where: { id }, data });
  }
}
