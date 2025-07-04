import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import type { CreateIncidentDto } from './dto/create-incident.dto';
import type { UpdateIncidentDto } from './dto/update-incident.dto';

@Injectable()
export class IncidentsService {
  constructor(private prisma: PrismaService) {}

  async create(createIncidentDto: CreateIncidentDto) {
    try {
      return await this.prisma.incident.create({
        data: createIncidentDto,
        include: {
          assignedTo: {
            select: {
              email: true,
            },
          },
        },
      });
    } catch (error: unknown) {
      if (this.isPrismaError(error)) {
        if (error.code === 'P2002') {
          throw new BadRequestException(
            'Incident with this data already exists'
          );
        }
        if (error.code === 'P2003') {
          throw new BadRequestException('Invalid assignedToId provided');
        }
      }
      throw new InternalServerErrorException('Failed to create incident');
    }
  }

  async findAll() {
    try {
      return await this.prisma.incident.findMany({
        include: {
          assignedTo: {
            select: {
              email: true,
            },
          },
        },
      });
    } catch {
      throw new InternalServerErrorException('Failed to fetch incidents');
    }
  }

  async update(id: string, updateIncidentDto: UpdateIncidentDto) {
    try {
      const incident = await this.prisma.incident.update({
        where: { id },
        data: {
          status: updateIncidentDto.status,
          assignedToId: updateIncidentDto.assignedToId,
        },
        include: {
          assignedTo: {
            select: {
              email: true,
            },
          },
        },
      });
      return incident;
    } catch (error: unknown) {
      if (this.isPrismaError(error)) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Incident with ID ${id} not found`);
        }
        if (error.code === 'P2003') {
          throw new BadRequestException('Invalid assignedToId provided');
        }
      }
      throw new InternalServerErrorException('Failed to update incident');
    }
  }

  private isPrismaError(error: unknown): error is { code: string } {
    return typeof error === 'object' && error !== null && 'code' in error;
  }
}
