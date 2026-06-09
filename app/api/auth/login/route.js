import { NextResponse } from 'next/server';
import { verifyPassword, generateToken } from '../../../../lib/auth.js';

export async function POST(request) {
  try {
    const { password } = await request.json();
    
    if (verifyPassword(password)) {
      const token = generateToken();
      const response = NextResponse.json({ success: true });
      response.cookies.set({
        name: 'admin_token',
        value: token,
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24, // 24 hours
        sameSite: 'lax'
      });
      return response;
    }
    
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
