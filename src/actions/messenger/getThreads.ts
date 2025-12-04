"use server";

import { cookies } from 'next/headers';
import ServerAdapter from 'nextjs-messenger/dist/messenger/api/serverAdapter';
import { GATEWAY_TOKEN_NAME } from '@/config/internals';
import type { Thread } from 'nextjs-messenger';

type GetThreadsResult = Thread[];

export default async function getThreads(): Promise<GetThreadsResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get(GATEWAY_TOKEN_NAME)?.value;

  const adapter = new ServerAdapter({
    baseUrl: process.env.API_BASE_URL || "",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  const res = await adapter.getThreads();

  if (Array.isArray(res)) return res;
  if (res && typeof res === "object" && "data" in res) {
    const maybeData = (res as Record<string, unknown>).data;
    if (Array.isArray(maybeData)) return maybeData as Thread[];
  }

  return [] as Thread[];
}
