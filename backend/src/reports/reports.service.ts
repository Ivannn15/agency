import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ReportStatus, UserRole } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async list(user: any, projectId?: string, status?: ReportStatus) {
    return this.prisma.report.findMany({
      where: { agencyId: user.agencyId, projectId: projectId || undefined, status: status || undefined },
      include: { project: { include: { client: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async ensureProjectAccess(user: any, projectId: string) {
    const project = await this.prisma.project.findFirst({ where: { id: projectId, agencyId: user.agencyId } });
    if (!project) throw new BadRequestException('Project not found in your agency');
    return project;
  }

  async create(user: any, data: any) {
    await this.ensureProjectAccess(user, data.projectId);
    return this.prisma.report.create({ data: { ...data, status: ReportStatus.DRAFT, agencyId: user.agencyId } });
  }

  async get(user: any, id: string) {
    const report = await this.prisma.report.findFirst({ where: { id, agencyId: user.agencyId }, include: { project: { include: { client: true } } } });
    if (!report) throw new NotFoundException('Report not found');
    return report;
  }

  async update(user: any, id: string, data: any) {
    await this.get(user, id);
    return this.prisma.report.update({ where: { id }, data });
  }

  async publish(user: any, id: string) {
    await this.get(user, id);
    return this.prisma.report.update({ where: { id }, data: { status: ReportStatus.PUBLISHED, publishedAt: new Date() } });
  }

  async clientOverview(user: any) {
    const clientId = user.clientId;
    const client = await this.prisma.client.findUnique({ where: { id: clientId }, include: { projects: true } });
    if (!client) throw new NotFoundException('Client not found');
    const projects = await this.prisma.project.findMany({
      where: { clientId },
      include: { reports: { where: { status: ReportStatus.PUBLISHED }, orderBy: { periodEnd: 'desc' }, take: 3 } },
    });
    return { client, projects };
  }

  async clientReport(user: any, id: string) {
    const clientId = user.clientId;
    const report = await this.prisma.report.findFirst({
      where: {
        id,
        status: ReportStatus.PUBLISHED,
        project: { clientId },
      },
      include: { project: { include: { client: true } } },
    });
    if (!report) throw new NotFoundException('Report not accessible');
    return report;
  }
}
