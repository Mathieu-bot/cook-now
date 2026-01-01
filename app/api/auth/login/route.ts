import { prisma } from '@/lib/db';
import { AUTH_COOKIE_NAME, AUTH_TOKEN_MAX_AGE_SECONDS, createAuthToken, verifyPassword } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "We couldn't log you in. Check your email and password, then try again." },
      { status: 401 },
    );
  }

  if (!body || typeof body !== 'object') {
    return Response.json(
      { error: "We couldn't log you in. Check your email and password, then try again." },
      { status: 401 },
    );
  }

  const { email, password } = body as { email?: unknown; password?: unknown };

  if (typeof email !== 'string' || typeof password !== 'string') {
    return Response.json(
      { error: "We couldn't log you in. Check your email and password, then try again." },
      { status: 401 },
    );
  }

  const normalizedEmail = email.trim().toLowerCase();
  const trimmedPassword = password.trim();

  if (!normalizedEmail || !trimmedPassword) {
    return Response.json(
      { error: "We couldn't log you in. Check your email and password, then try again." },
      { status: 401 },
    );
  }

  const userRecord = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!userRecord) {
    return Response.json(
      { error: "We couldn't log you in. Check your email and password, then try again." },
      { status: 401 },
    );
  }

  const passwordOk = await verifyPassword(trimmedPassword, userRecord.passwordHash);

  if (!passwordOk) {
    return Response.json(
      { error: "We couldn't log you in. Check your email and password, then try again." },
      { status: 401 },
    );
  }

  const token = createAuthToken(userRecord.id);

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: AUTH_TOKEN_MAX_AGE_SECONDS,
  });

  const user = {
    id: userRecord.id,
    email: userRecord.email,
  };

  return Response.json({ user }, { status: 200 });
}
