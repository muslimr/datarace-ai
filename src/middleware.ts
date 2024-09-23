import acceptLanguage from 'accept-language';
import { fallbackLng, languages } from 'app/i18n/settings';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';


acceptLanguage.languages(languages);

export const config = {
  matcher: ['/', '/(en|az)/:path*'],
};

const cookieName = 'i18next';

export function middleware(req: NextRequest) {
  let lng;
  if (req.cookies.has(cookieName)) lng = acceptLanguage.get(req.cookies.get(cookieName)?.value);
  if (!lng) lng = acceptLanguage.get(req.headers.get('Accept-Language'));
  if (!lng) lng = fallbackLng;

  NextResponse.redirect(new URL(`/${lng}${req.nextUrl.search}`, req.url));

  if (req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL(`/${lng}${req.nextUrl.search}`, req.url));
  }

  if (req.headers.has('referer')) {
    const refererUrl = new URL(req.headers.get('referer') as string);
    const lngInReferer = languages.find((l: string) => refererUrl.pathname.startsWith(`/${l}`));
    const response = NextResponse.next();
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer);
    return response;
  }

  return NextResponse.next();
}
