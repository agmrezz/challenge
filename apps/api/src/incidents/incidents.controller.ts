import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import type { CreateIncidentDto } from './dto/create-incident.dto';
import type { UpdateIncidentDto } from './dto/update-incident.dto';
import { IncidentsService } from './incidents.service';

@UseGuards(JwtAuthGuard)
@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Post()
  create(@Body() createIncidentDto: CreateIncidentDto) {
    return this.incidentsService.create(createIncidentDto);
  }

  @Get()
  findAll() {
    return this.incidentsService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateIncidentDto: UpdateIncidentDto
  ) {
    return this.incidentsService.update(id, updateIncidentDto);
  }
}
