import { zodFetch } from '@/zodFetch';
import { incidentsSchema, UpdateStatus } from './schemas';

export async function getIncidents() {
  const res = await zodFetch(
    incidentsSchema,
    `${process.env.NEXT_PUBLIC_API_URL}/incidents`,
    {
      credentials: 'include',
    }
  );

  if (res.ok && res.data) {
    return res.data;
  }

  throw new Error('Failed to fetch incidents');
}

export async function createIncident(title: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/incidents`, {
    method: 'PUT',
    body: JSON.stringify({ title }),
    credentials: 'include',
  });
  return res.json();
}

export async function updateIncident(data: UpdateStatus) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/incidents/${data.id}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    }
  );

  return res.json();
}
