// middleware.js
import { NextResponse } from 'next/server';

export const config = {
    matcher: [
        // run on all page routes (no change)
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};

export async function middleware(req) {
    const { nextUrl: url } = req;
    const { pathname, origin } = url;

    // 1) Extract host/subdomain
    //    e.g. "tenant1.localhost:3000" → tenant="tenant1", rest=["localhost","3000"]
    const host = req.headers.get('host') || '';
    const hostParts = host.split('.');
    const tenant = hostParts[0];
    const isLocalhostPattern = host.endsWith('localhost') || host.includes('localhost:');

    if (hostParts?.length <= 1) {
        return NextResponse.next();
    }

    // console.log(`Running middleware for tenant="${tenant}" hostParts=${JSON.stringify(hostParts)}`);

    // 2) Pull access_token & valid_tenant cookie
    const token = req.cookies.get('access_token')?.value;
    const validTenantFlag = req.cookies.get('valid_tenant')?.value;
    if (validTenantFlag === tenant) {
        return handleAuthRedirects();
    }

    // 3) Build your check-domain URL dynamically
    //    In dev we point at local API, in prod your real domain
    const apiHost = process.env.NEXT_PUBLIC_BASE_API_URL;
    const checkUrl = `${apiHost}/check-domain/?sub_domain=${tenant}.theplatinumstore.xyz`;

    // 4) Verify tenant once, cache in cookie
    try {
        const resp = await fetch(checkUrl, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json, text/plain, */*',
            }
        });

        if (resp.status === 404) {
            throw new Error('Domain not found');
        }
        const data = await resp.json();
        if (data.status !== 'success') {
            return NextResponse.rewrite(`${origin}/404`);
        }

        // domain OK → set cache cookie + handle redirects
        const res = handleAuthRedirects();
        res.cookies.set({
            name: 'valid_tenant',
            value: tenant,
            path: '/',
            maxAge: 60 * 5,   // 5 minutes
        });
        return res;

    } catch (err) {
        console.error('Tenant validation failed:', err);
        return NextResponse.rewrite(`${origin}/404`);
    }

    // 5) Your “/ → login vs. dashboard” logic
    function handleAuthRedirects() {
        if (pathname === '/') {
            // reconstruct host for redirect (preserves port in dev)
            let targetHost = host;
            // if we’re on “localhost” without subdomain, you might want to
            // skip tenant logic altogether—but here we assume tenant.localhost:3000
            if (!isLocalhostPattern && hostParts.length < 2) {
                return NextResponse.next();
            }

            // go to dashboard if token exists, else login
            const destPath = token ? '/dashboard' : '/login';
            return NextResponse.redirect(`${url.protocol}//${targetHost}${destPath}`);
        }
        return NextResponse.next();
    }
}
