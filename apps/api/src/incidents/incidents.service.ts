import { Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import type { CreateIncidentDto } from './dto/create-incident.dto';
import type { UpdateIncidentDto } from './dto/update-incident.dto';

@Injectable()
export class IncidentsService {
  constructor(private prisma: PrismaService) {}

  create(createIncidentDto: CreateIncidentDto) {
    return this.prisma.incident.create({
      data: createIncidentDto,
    });
  }

  findAll() {
    return this.prisma.incident.findMany();
  }

  update(id: string, updateIncidentDto: UpdateIncidentDto) {
    return this.prisma.incident.update({
      where: { id },
      data: {
        status: updateIncidentDto.status,
        assignedToId: updateIncidentDto.assignedToId,
      },
    });
  }
}
