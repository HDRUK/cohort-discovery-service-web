import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { GATEWAY_TOKEN_NAME } from '@/config/internals';

const UPSTREAM = process.env.MESSENGER_API_BASE || process.env.NEXT_PUBLIC_API_BASE_URL;

function joinPath(parts: string[] = []) {
  const p = '/' + parts.map((s) => s.replace(/^\/+|\/+$/g, '')).filter(Boolean).join('/');
  return p === '/' ? '' : p;
}

async function proxyRequest(request: Request, pathParts: string[]) {
  if (!UPSTREAM) {
    return NextResponse.json({ message: 'Upstream base url not configured' }, { status: 500 });
  }

  const cookieStore = cookies();
  const token = cookieStore.get(GATEWAY_TOKEN_NAME)?.value;

  const upstreamUrl = `${UPSTREAM.replace(/\/+$/g, '')}${joinPath(pathParts)}${request.url.includes('?') ? '?' + request.url.split('?')[1] : ''}`;

  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  // Forward content-type if present
  const ct = request.headers.get('content-type');
  if (ct) headers['Content-Type'] = ct;

  const init: RequestInit = {
    method: request.method,
    headers,
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const body = await request.arrayBuffer();
    init.body = body;
  }

  const res = await fetch(upstreamUrl, init);
  const contentType = res.headers.get('content-type') || 'application/json';
  const body = await res.arrayBuffer();

  const resp = new NextResponse(body, { status: res.status });
  resp.headers.set('Content-Type', contentType);
  return resp;
}

export async function GET(request: Request, { params }: { params: { path?: string[] } }) {
  return proxyRequest(request, params?.path || []);
}
export async function POST(request: Request, { params }: { params: { path?: string[] } }) {
  return proxyRequest(request, params?.path || []);
}
export async function PUT(request: Request, { params }: { params: { path?: string[] } }) {
  return proxyRequest(request, params?.path || []);
}
export async function DELETE(request: Request, { params }: { params: { path?: string[] } }) {
  return proxyRequest(request, params?.path || []);
}
export async function PATCH(request: Request, { params }: { params: { path?: string[] } }) {
  return proxyRequest(request, params?.path || []);
}
