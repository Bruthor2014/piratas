import { cookies } from 'next/headers';
import { createHash } from 'crypto';

const COOKIE = 'piratas_admin';

function token() {
  const password = process.env.ADMIN_PASSWORD || '';
  return createHash('sha256').update(`los-piratas:${password}`).digest('hex');
}

export async function isAdmin() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  return (await cookies()).get(COOKIE)?.value === token();
}

export async function setAdminCookie() {
  (await cookies()).set(COOKIE, token(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 8
  });
}

export async function clearAdminCookie() {
  (await cookies()).delete(COOKIE);
}
