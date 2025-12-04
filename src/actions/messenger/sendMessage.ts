"use server";

import { cookies } from 'next/headers';
import ServerAdapter from 'nextjs-messenger/dist/messenger/api/serverAdapter';
import { GATEWAY_TOKEN_NAME } from '@/config/internals';
import type { Message, SendMessagePayload } from 'nextjs-messenger';

export default async function sendMessage(payload: SendMessagePayload): Promise<Message> {
  const cookieStore = await cookies();
  const token = cookieStore.get(GATEWAY_TOKEN_NAME)?.value;

  const adapter = new ServerAdapter({
    baseUrl: process.env.API_BASE_URL,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  const msg = await adapter.sendMessage(payload);
  return msg;
}
