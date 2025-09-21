import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const theme = req.cookies.get('ilo-theme')?.value;

  if (theme === 'dark' || theme === 'light') {
    res.headers.set('x-ilo-theme', theme);
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next|favicon|icons|manifest).*)'],
};
