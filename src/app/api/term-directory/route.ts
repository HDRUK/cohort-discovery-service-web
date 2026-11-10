import { NextRequest } from "next/server";
import { ErrorMode } from "@/server/api";
import { getTermDirectory } from "@/server/data/termDirectory";
import { badRequest, withSession } from "@/server/routeHandler";
import { parseTermDirectoryParams } from "@/utils/routeParams";

export async function GET(req: NextRequest) {
  return withSession(async () => {
    const params = parseTermDirectoryParams(req.nextUrl.searchParams);
    if (!params) return badRequest("Invalid term directory params");

    return getTermDirectory(
      params.page,
      params.perPage,
      params.search,
      params.domain,
      params.collections,
      params.sort,
      ErrorMode.RESULT,
    );
  });
}
