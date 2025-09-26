// middleware.js
import { NextResponse } from 'next/server';

export const config = {
    matcher: '/:path*',
};

export async function middleware(req) {
    const { pathname, origin } = req.nextUrl

    // 1) Skip Next internals & API routes
    if (
        pathname.startsWith('/api') ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/favicon')
    ) {
        return NextResponse.next();
    }

    // 2) Extract subdomain
    const host = req.headers.get('host');
    const hostname = host.split(':')[0];
    const parts = hostname.split('.');

    // If no subdomain or localhost, treat as public landing
    if (parts.length < 2 || hostname === 'localhost') {
        return NextResponse.next();
    }

    const tenant = parts[0];

    try {
        // 3) Verify tenant
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/check-domain/?sub_domain=${tenant}.apexodr-uat.com`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json, text/plain, */*",
                }
            }
        );

        console.log('response', response)


        if (response.status == 404) {
            throw new Error('Domain verification failed');
        }

        const data = await response.json();

        // 4) Invalid → show 404
        if (data.status !== "success") {
            return NextResponse.rewrite(new URL('/404', origin));
        }

        // 5) Handle valid tenant
        // If root path, redirect to login
        if (pathname === '/') {
            return NextResponse.redirect(
                `${origin.replace('localhost', `${tenant}.localhost`)}/login`
            );
        }

        return NextResponse.next();
    } catch (error) {
        console.log('Middleware error:', error);
        return NextResponse.rewrite(new URL('/404', origin));
    }
}