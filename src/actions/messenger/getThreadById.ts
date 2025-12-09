"use server";

import { cookies } from 'next/headers';
import { ServerAdapter } from 'nextjs-messenger/dist/messenger/api/serverAdapter';
import { GATEWAY_TOKEN_NAME } from '@/config/internals';
import type { Thread } from 'nextjs-messenger';

export default async function getThreadById(threadId: number): Promise<Thread> {
  const cookieStore = await cookies();
  const token = cookieStore.get(GATEWAY_TOKEN_NAME)?.value;

  const adapter = new ServerAdapter({
    baseUrl: process.env.API_BASE_URL || "",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  const thread = await adapter.getThreadById(threadId);
  return thread;
}
