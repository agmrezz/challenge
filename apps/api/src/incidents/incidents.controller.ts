import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import type { CreateIncidentDto } from './dto/create-incident.dto';
import type { UpdateIncidentDto } from './dto/update-incident.dto';

@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Post()
  create() {
    return this.incidentsService.create();
  }

  @Get()
  findAll() {
    return this.incidentsService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIncidentDto: UpdateIncidentDto) {
    return this.incidentsService.update(+id, updateIncidentDto);
  }

 
}
