import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/admin-secret')) {
    return NextResponse.next();
  }

  const hasSession = request.cookies.get('eeeco_session')?.value === '1';
  const role = request.cookies.get('eeeco_role')?.value;

  if (!hasSession || role !== 'admin') {
    const destination = request.nextUrl.clone();
    destination.pathname = '/account';
    destination.searchParams.set('denied', 'admin');

    return NextResponse.redirect(destination);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin-secret/:path*']
};