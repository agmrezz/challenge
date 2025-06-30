import { z } from 'zod';

export const incidentSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'CLOSED']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  createdAt: z.string(),
  updatedAt: z.string(),
  assignedToId: z.string().nullish(),
});

export const incidentsSchema = z.array(incidentSchema);

export type Incident = z.infer<typeof incidentSchema>;
