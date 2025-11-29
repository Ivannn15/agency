import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterAgencyDto, LoginDto } from './dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  private signToken(userId: string, role: UserRole) {
    return this.jwtService.sign({ sub: userId, role }, { secret: process.env.JWT_SECRET || 'changeme', expiresIn: '7d' });
  }

  async registerAgency(dto: RegisterAgencyDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new BadRequestException('Email already in use');
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const agency = await this.prisma.agency.create({ data: { name: dto.agencyName } });
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        fullName: dto.fullName,
        passwordHash,
        role: UserRole.AGENCY_OWNER,
        agencyId: agency.id,
      },
      include: { agency: true },
    });
    const token = this.signToken(user.id, user.role);
    return { user, token };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email }, include: { agency: true, client: true } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    const token = this.signToken(user.id, user.role);
    return { user, token };
  }

  async me(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId }, include: { agency: true, client: true } });
  }
}
