import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { GATEWAY_TOKEN_NAME } from '@/config/internals';

const UPSTREAM = process.env.MESSENGER_API_BASE || process.env.NEXT_PUBLIC_API_BASE_URL;

function joinPath(parts: string[] = []) {
  const p = '/' + parts.map((s) => s.replace(/^\/+|\/+$/g, '')).filter(Boolean).join('/');
  return p === '/' ? '' : p;
}

async function proxyRequest(request: NextRequest, pathParts: string[]) {
  if (!UPSTREAM) {
    return NextResponse.json({ message: 'Upstream base url not configured' }, { status: 500 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(GATEWAY_TOKEN_NAME)?.value;

  const urlObj = new URL(request.url);
  const upstreamUrl =
    UPSTREAM.replace(/\/+$/g, '') +
    joinPath(pathParts) +
    (urlObj.search ? urlObj.search : '');

  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const contentType = request.headers.get('content-type');
  if (contentType) headers['Content-Type'] = contentType;

  const init: RequestInit = {
    method: request.method,
    headers,
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const body = await request.arrayBuffer();
    init.body = body;
  }

  const res = await fetch(upstreamUrl, init);
  const responseContentType = res.headers.get('content-type') || 'application/json';
  const body = await res.arrayBuffer();

  const resp = new NextResponse(body, { status: res.status });
  resp.headers.set('Content-Type', responseContentType);
  return resp;
}

// Lean unified handler generator
function createHandler(method: string) {
  return async function handler(
    request: NextRequest,
    context: { params?: { path?: string[] } } | undefined,
  ) {
    // Handle possible Promise for params
    let pathParts: string[] = [];
    if (context?.params instanceof Promise) {
      pathParts = (await context.params).path || [];
    } else {
      pathParts = context?.params?.path || [];
    }

    if (request.method !== method) {
      return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
    }

    return proxyRequest(request, pathParts);
  };
}

// Export handlers
export const GET = createHandler('GET');
export const POST = createHandler('POST');
export const PUT = createHandler('PUT');
export const DELETE = createHandler('DELETE');
export const PATCH = createHandler('PATCH');
