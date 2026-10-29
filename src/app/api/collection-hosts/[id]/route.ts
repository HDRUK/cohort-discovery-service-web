import { cookies } from "next/headers";
import { ACCESS_TOKEN_NAME } from "@/config/internals";
import { apiGetUncached, ErrorMode } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, CollectionHostWithCredentials } from "@/types/api";
import {
  parseCollectionHostId,
  toCollectionHostCredentials,
} from "@/utils/collectionHosts";

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
  >(API_ROUTES.collectionHost(hostId), {
    cache: "no-store",
    errorMode: ErrorMode.RESULT,
  });

  if (!result.data) {
    return new Response(result.error?.text ?? "Collection host not found", {
      status: result.error?.code ?? 404,
    });
  }

  return Response.json(toCollectionHostCredentials(result.data), {
    headers: { "Cache-Control": "no-store" },
  });
}
