import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'nest-symposium-secret-key-2026';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'nest@admin2026';

export function verifyPassword(password) {
  return password === ADMIN_PASSWORD;
}

export function generateToken() {
  return jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token');
  if (!token) return false;
  return verifyToken(token.value) !== null;
}
