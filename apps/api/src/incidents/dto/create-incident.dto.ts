import { IncidentPriority, IncidentStatus } from '@repo/database';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateIncidentDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsEnum(IncidentStatus)
  status?: IncidentStatus;

  @IsEnum(IncidentPriority)
  priority!: IncidentPriority;
}
