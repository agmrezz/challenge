import { loginResponseSchema } from '@/features/auth/schema';
import { zodFetch } from '@/zodFetch';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  try {
    const res = await zodFetch(
      loginResponseSchema,
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
      }
    );

    if (res.ok && res.data) {
      const cookieStore = await cookies();
      cookieStore.set('access_token', `Bearer ${res.data.access_token}`, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60, // 1 hour
      });
      return NextResponse.json(res.data);
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
}
