import { prisma } from '@/lib/db';
import { AUTH_COOKIE_NAME, AUTH_TOKEN_MAX_AGE_SECONDS, createAuthToken, hashPassword } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "We couldn't read your request. Make sure you send a valid email and password." },
      { status: 400 },
    );
  }

  if (!body || typeof body !== 'object') {
    return Response.json(
      { error: "We couldn't read your request. Make sure you send a valid email and password." },
      { status: 400 },
    );
  }

  const { email, password } = body as { email?: unknown; password?: unknown };

  if (typeof email !== 'string' || typeof password !== 'string') {
    return Response.json(
      { error: 'Please provide both an email and a password to create your account.' },
      { status: 400 },
    );
  }

  const normalizedEmail = email.trim().toLowerCase();
  const trimmedPassword = password.trim();

  if (!normalizedEmail) {
    return Response.json(
      { error: 'Email is required to create your account.' },
      { status: 400 },
    );
  }

  if (trimmedPassword.length < 8) {
    return Response.json(
      { error: 'Your password needs to be at least 8 characters long.' },
      { status: 400 },
    );
  }

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true },
  });

  if (existing) {
    return Response.json(
      { error: 'This email is already used on CookNow. Try logging in or use a different email.' },
      { status: 400 },
    );
  }

  const passwordHash = await hashPassword(trimmedPassword);

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      passwordHash,
    },
    select: {
      id: true,
      email: true,
    },
  });

  const token = createAuthToken(user.id);

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: AUTH_TOKEN_MAX_AGE_SECONDS,
  });

  return Response.json({ user }, { status: 201 });
}
