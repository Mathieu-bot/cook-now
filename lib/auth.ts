import { cookies } from 'next/headers';
import { prisma } from './db';
import { createHmac, randomBytes, scrypt as nodeScrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(nodeScrypt);

type AuthTokenPayload = {
  userId: string;
  exp: number;
};

export const AUTH_COOKIE_NAME = 'cooknow_auth';
export const AUTH_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error('AUTH_SECRET is not set');
  }
  return secret;
}

function base64UrlEncode(input: string | Buffer): string {
  const buffer = typeof input === 'string' ? Buffer.from(input, 'utf8') : input;
  const base64 = buffer.toString('base64');
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
  return Buffer.from(padded, 'base64').toString('utf8');
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString('hex')}`;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const parts = hash.split(':');
  if (parts.length !== 2) {
    return false;
  }
  const [salt, storedKeyHex] = parts;
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  const storedKey = Buffer.from(storedKeyHex, 'hex');
  if (storedKey.length !== derivedKey.length) {
    return false;
  }
  return timingSafeEqual(storedKey, derivedKey);
}

export function signAuthToken(payload: AuthTokenPayload): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const data = `${encodedHeader}.${encodedPayload}`;
  const signature = createHmac('sha256', getAuthSecret()).update(data).digest('base64');
  const encodedSignature = signature.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  return `${data}.${encodedSignature}`;
}

export function verifyAuthToken(token: string | null | undefined): AuthTokenPayload | null {
  if (!token) {
    return null;
  }
  const parts = token.split('.');
  if (parts.length !== 3) {
    return null;
  }
  const [encodedHeader, encodedPayload, signature] = parts;
  const data = `${encodedHeader}.${encodedPayload}`;
  const expectedSignatureBase64 = createHmac('sha256', getAuthSecret()).update(data).digest('base64');
  const expectedSignature = expectedSignatureBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (sigBuffer.length !== expectedBuffer.length) {
    return null;
  }
  if (!timingSafeEqual(sigBuffer, expectedBuffer)) {
    return null;
  }
  const payloadJson = base64UrlDecode(encodedPayload);
  const payload = JSON.parse(payloadJson) as AuthTokenPayload;
  if (typeof payload.exp !== 'number') {
    return null;
  }
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp < now) {
    return null;
  }
  return payload;
}

export function createAuthToken(userId: string, maxAgeSeconds: number = AUTH_TOKEN_MAX_AGE_SECONDS): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: AuthTokenPayload = {
    userId,
    exp: now + maxAgeSeconds,
  };
  return signAuthToken(payload);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const payload = verifyAuthToken(token);
  if (!payload) {
    return null;
  }
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
  });
  return user;
}
