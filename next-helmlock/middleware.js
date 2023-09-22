import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const cspHeader = `
    default-src 'self';
    script-src 'report-sample' 'self' 'nonce-${nonce}' 'strict-dynamic https://www.paypal.com/sdk/js wasm-eval;
    style-src 'report-sample' 'self' 'nonce-${nonce}';
    object-src 'none';
    base-uri 'self';
    connect-src 'self' https://www.sandbox.paypal.com;
    font-src 'self';
    frame-src 'self' https://www.sandbox.paypal.com;
    img-src 'self' https://www.paypalobjects.com;
    manifest-src 'self';
    media-src 'self';
    report-uri https://650d7033a068cd9821c1f224.endpoint.csper.io/?v=0;
    worker-src 'none';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
`;

  const requestHeaders = new Headers();
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set(
    'Content-Security-Policy',
    // Replace newline characters and spaces
    cspHeader.replace(/\s{2,}/g, ' ').trim()
  );
  const res = NextResponse.next({
    headers: requestHeaders,
    req: {
      headers: requestHeaders,
    },
  });

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  await supabase.auth.getSession();

  return res;
}
