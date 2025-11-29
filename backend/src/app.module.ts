import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AgenciesModule } from './agencies/agencies.module';
import { ClientsModule } from './clients/clients.module';
import { ProjectsModule } from './projects/projects.module';
import { ReportsModule } from './reports/reports.module';
import { PrismaService } from './common/prisma.service';

@Module({
  imports: [AuthModule, AgenciesModule, ClientsModule, ProjectsModule, ReportsModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
