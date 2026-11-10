import { NextRequest } from "next/server";
import { ErrorMode } from "@/server/api";
import { getQuery } from "@/server/data/queries";
import { badRequest, withSession } from "@/server/routeHandler";
import { isPid, parseQueryListParams } from "@/utils/routeParams";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ pid: string }> },
) {
  return withSession(async () => {
    const { pid } = await params;
    if (!isPid(pid)) return badRequest("Invalid query pid");

    return getQuery(pid, {
      params: parseQueryListParams(req.nextUrl.searchParams),
      errorMode: ErrorMode.RESULT,
    });
  });
}
