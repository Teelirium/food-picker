import { NextRequest, NextResponse } from 'next/server';

const throw404 = ['/api/doc', '/swagger', '/api/test'];

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  if (process.env.NODE_ENV === 'production' && throw404.some((path) => req.url.endsWith(path))) {
    url.pathname = '/404';
    return NextResponse.rewrite(url);
  }
}

export const config = {};
