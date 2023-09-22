import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  // generate CSP and nonce
  const { csp, nonce } = generateCsp();

  // Clone the request headers
  const requestHeaders = new Headers(request.headers);

  // set nonce request header to read in pages if needed
  requestHeaders.set('x-nonce', nonce);

  // set CSP header
  // switching for report-only or regular for repro on
  // https://github.com/vercel/next.js/issues/48966
  const headerKey =
    request.nextUrl.pathname === '/csp-report-only'
      ? 'content-security-policy-report-only'
      : 'content-security-policy';

  // Set the CSP header so that `app-render` can read it and generate tags with the nonce
  requestHeaders.set(headerKey, csp);
  const res = NextResponse.next({
    request: {
      // New request headers
      headers: requestHeaders,
    },
  });

  // Also set the CSP so that it is outputted to the browser
  res.headers.set(headerKey, csp);

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  await supabase.auth.getSession();

  return res;
}
