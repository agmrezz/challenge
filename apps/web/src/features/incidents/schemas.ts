import { z } from 'zod';

export const incidentSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.enum(['OPEN', 'CLOSED']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  createdAt: z.string(),
  updatedAt: z.string(),
  assignedToId: z.string().nullish(),
  assignedTo: z
    .object({
      email: z.string(),
    })
    .nullish(),
});

export const incidentsSchema = z.array(incidentSchema);

export type Incident = z.infer<typeof incidentSchema>;

export const updateStatusSchema = incidentSchema
  .pick({
    id: true,
    status: true,
    assignedToId: true,
  })
  .partial();

export type UpdateStatus = z.infer<typeof updateStatusSchema>;

export const usersSchema = z.array(
  z.object({
    id: z.string(),
    email: z.string(),
  })
);

export type User = z.infer<typeof usersSchema>;
