import { zodFetch } from '@/zodFetch';
import { incidentsSchema } from './schemas';

export async function getIncidents() {
  const res = await zodFetch(
    incidentsSchema,
    `${process.env.NEXT_PUBLIC_API_URL}/incidents`
  );

  if (res.ok && res.data) {
    return res.data;
  }

  throw new Error('Failed to fetch incidents');
}
