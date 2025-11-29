import { Module } from '@nestjs/common';
import { AgenciesService } from './agencies.service';
import { AgenciesController } from './agencies.controller';
import { PrismaService } from '../common/prisma.service';

@Module({
  providers: [AgenciesService, PrismaService],
  controllers: [AgenciesController],
})
export class AgenciesModule {}
