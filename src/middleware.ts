import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';


// Create middleware
const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Define locales and the default locale
    const locales = ['az', 'en'];
    const cookies = req.cookies;
    const defaultLocale = cookies.get('language')?.value || 'az';

    // Regular expression to prevent duplicate locales
    const localePattern = new RegExp(`^/(az|en)(/\\1)+`);

    // Check for duplicate locales in the path
    if (localePattern.test(pathname)) {
        const correctedPath = pathname.replace(localePattern, '/$1');
        return NextResponse.redirect(new URL(correctedPath, req.url));
    }

    // Split the pathname into segments
    const segments = pathname.split('/').filter(Boolean); // Filter out empty segments

    // If the pathname does not start with a locale, prepend the default locale
    if (segments.length === 0 || !locales.includes(segments[0])) {
        const correctedPath = `/${defaultLocale}${pathname}`;
        return NextResponse.redirect(new URL(correctedPath, req.url));
    }

    // Check if the route exists in your app (optional dynamic validation)
    const validLocalesPath = new RegExp(`^/(${locales.join('|')})(/.*)?$`);
    if (!validLocalesPath.test(pathname)) {
        // Redirect directly to the 404 page
        return NextResponse.redirect(new URL(`/${defaultLocale}/404`, req.url));
    }

    // Proceed to the next middleware if it starts with a valid locale
    return intlMiddleware(req);
}

export const config = {
    // Match only internationalized pathnames
    matcher: ['/', '/(az|en)/:path*'],
};
