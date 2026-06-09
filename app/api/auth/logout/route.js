import { NextResponse } from 'next/server';

export async function POST(request) {
  const response = NextResponse.redirect(new URL('/admin', request.url));
  response.cookies.delete('admin_token');
  return response;
}
