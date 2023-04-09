import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return new NextResponse(null, { status: 404 });
  }
}

export const config = {
  matcher: ['/api/doc', '/swagger', '/api/test'],
};
