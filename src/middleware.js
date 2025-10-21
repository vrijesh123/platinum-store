// middleware.js
import { NextResponse } from "next/server";

export const config = {
  matcher: [
    // run on all page routes (no change)
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

export async function middleware(req) {
  const { nextUrl: url } = req;
  const { pathname, origin } = url;

  const host = req.headers.get("host") || "";
  const hostParts = host.split("."); // e.g. ["foo","apexodr","com"]
  const isLocalhost = /localhost(:\d+)?$/.test(host);

  const isPlatinum = isLocalhost
    ? hostParts.length <= 1 // tenant.localhost:3000 → subdomain, localhost:3000 → apex
    : hostParts.length === 2 || host.startsWith("www.");


  if (isPlatinum) {
    return NextResponse.next();
  }

  const tenant = hostParts[0];

  // 2) Pull access_token & valid_tenant cookie
  const token = req.cookies.get("access_token")?.value;
  const validTenantFlag = req.cookies.get("valid_tenant")?.value;
  const isClient = req.cookies.get("is_client")?.value === "true";

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
        "Content-Type": "application/json",
        Accept: "application/json, text/plain, */*",
      },
    });

    if (resp.status === 404) {
      throw new Error("Domain not found");
    }
    const data = await resp.json();
    if (data.status !== "success") {
      return NextResponse.rewrite(`${origin}/404`);
    }

    // domain OK → set cache cookie + handle redirects
    const res = handleAuthRedirects();
    res.cookies.set({
      name: "valid_tenant",
      value: tenant,
      path: "/",
      maxAge: 60 * 5, // 5 minutes
    });
    return res;
  } catch (err) {
    console.error("Tenant validation failed:", err);
    return NextResponse.rewrite(`${origin}/404`);
  }

  function handleAuthRedirects() {
    // Only redirect on homepage to avoid infinite loops
    if (pathname === "/") {
      const targetHost = host;

      // If token present
      if (token) {
        // If client → /tenant/store
        if (isClient && validTenantFlag) {
          return NextResponse.redirect(
            `${url.protocol}//${targetHost}/tenant/store`
          );
        }
        // Otherwise → /dashboard
        return NextResponse.redirect(
          `${url.protocol}//${targetHost}/dashboard`
        );
      }

      // No token → /login
      return NextResponse.redirect(`${url.protocol}//${targetHost}/login`);
    }

    // For other paths, allow request
    return NextResponse.next();
  }
}
