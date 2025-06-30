import { Injectable } from '@nestjs/common';
import { IncidentPriority, IncidentStatus } from '@repo/database';
import { PrismaService } from './../prisma/prisma.service';
import type { UpdateIncidentDto } from './dto/update-incident.dto';

@Injectable()
export class IncidentsService {
  constructor(private prisma: PrismaService) {}

  create() {
    return this.prisma.incident.create({
      data: {
        title: 'hello',
        status: IncidentStatus.OPEN,
        priority: IncidentPriority.LOW,
      },
    });
  }

  findAll() {
    return this.prisma.incident.findMany();
  }

  update(id: number, updateIncidentDto: UpdateIncidentDto) {
    return `This action updates a #${id} incident`;
  }
}
