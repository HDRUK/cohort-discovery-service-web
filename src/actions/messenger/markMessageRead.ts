"use server";

import { cookies } from 'next/headers';
import { ServerAdapter } from 'nextjs-messenger';
import { GATEWAY_TOKEN_NAME } from '@/config/internals';

export default async function markMessageRead(messageId: number): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(GATEWAY_TOKEN_NAME)?.value;

  const adapter = new ServerAdapter({
    baseUrl: process.env.API_BASE_URL || "",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  await adapter.markMessageRead(messageId);
}
