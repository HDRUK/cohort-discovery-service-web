import "server-only";

import { getSession } from "@/server/session";
import { ApiResponse } from "@/types/api";

const SERVER_ERROR_TEXT = "Something went wrong. Try again later.";

const clientErrorText = ({ text, code }: { text: string; code: number }) =>
  code >= 500 ? SERVER_ERROR_TEXT : text;

export const toResponse = <T>(result: ApiResponse<T>): Response =>
  result.error
    ? new Response(clientErrorText(result.error), {
        status: result.error.code,
      })
    : Response.json(result, { headers: { "Cache-Control": "no-store" } });

export const badRequest = (text: string): Response =>
  new Response(text, { status: 400 });

export const withSession = async <T>(
  read: () => Promise<ApiResponse<T> | Response>,
): Promise<Response> => {
  const session = await getSession();
  if (!session) {
    return new Response("Not signed in", { status: 401 });
  }

  const result = await read();
  return result instanceof Response ? result : toResponse(result);
};
