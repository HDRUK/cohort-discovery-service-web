import { cookies } from "next/headers";
import { ACCESS_TOKEN_NAME } from "@/config/internals";
import { apiGetUncached, ErrorMode } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, CollectionHostWithCredentials } from "@/types/api";
import {
  parseCollectionHostId,
  toCollectionHostCredentials,
} from "@/utils/collectionHosts";

/**
 * Returns one collection host's client_id and client_secret, fetched on demand
 * when a user selects a collection or host. Host lists never carry credentials
 * (DP-1196), so this is the only way they reach the browser.
 *
 * Why a Route Handler and not 'use cache' or the other Cache Components tools:
 * - Credentials must never be cached anywhere on the server. 'use cache' would
 *   also need the user's JWT in its plain-text cache key (plan 01 D5), and
 *   'use cache: private' still keeps the result in the browser's router cache.
 * - The selected host is client state, not part of the URL, so a Server
 *   Component can't re-render for it.
 * - Server actions are for mutations, and Next runs them one at a time.
 * - The browser can't call Laravel directly, because the JWT stays on the
 *   server.
 *
 * So this follows the repo's rule for data the browser needs later: a GET
 * Route Handler, fetched by TanStack Query (useCollectionHostCredentials). The
 * API call is uncached, the response is no-store, and only the id and
 * credentials are returned. The API still decides who may see which host.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const cookieStore = await cookies();
  if (!cookieStore.get(ACCESS_TOKEN_NAME)?.value) {
    return new Response("Not signed in", { status: 401 });
  }

  const hostId = parseCollectionHostId((await params).id);
  if (hostId === null) {
    return new Response("Invalid collection host id", { status: 400 });
  }

  const result = await apiGetUncached<
    ApiResponse<CollectionHostWithCredentials | null>
  >(API_ROUTES.collectionHost(hostId), { errorMode: ErrorMode.RESULT });

  if (!result.data) {
    return new Response(result.error?.text ?? "Collection host not found", {
      status: result.error?.code ?? 404,
    });
  }

  return Response.json(toCollectionHostCredentials(result.data), {
    headers: { "Cache-Control": "no-store" },
  });
}
