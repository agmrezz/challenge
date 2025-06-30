import { IncidentStatus } from '@repo/database';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';

export class UpdateIncidentDto {
  @IsOptional()
  @IsEnum(IncidentStatus)
  status?: IncidentStatus;

  @IsOptional()
  @IsUUID()
  assignedToId?: string | null;
}
