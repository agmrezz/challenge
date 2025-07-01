import { z } from 'zod';

export const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const loginResponseSchema = z.object({
  access_token: z.string(),
});
