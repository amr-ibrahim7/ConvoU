import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('jwt')?.value;
  const { pathname } = request.nextUrl;



  const protectedPaths = ['/mymessages', '/profile'];
  const guestPaths = ['/login', '/signup'];


  if (protectedPaths.some(path => pathname.startsWith(path)) && !token) {
    console.log(`Redirecting to /login (protected route '${pathname}', no token)`);
    return NextResponse.redirect(new URL('/login', request.url));
  }


  if (guestPaths.some(path => pathname.startsWith(path)) && token) {
    console.log(`Redirecting to /mymessages (guest route '${pathname}', token found)`);
    return NextResponse.redirect(new URL('/mymessages', request.url));
  }

  // console.log('Allowing request to proceed.');
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};