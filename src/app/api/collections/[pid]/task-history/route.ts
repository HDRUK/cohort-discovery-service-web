import { NextRequest } from "next/server";
import { getCollectionTaskHistory } from "@/server/data/collections";
import { badRequest, withSession } from "@/server/routeHandler";
import { isPid, parseTimeRange } from "@/utils/routeParams";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ pid: string }> },
) {
  return withSession(async () => {
    const { pid } = await params;
    if (!isPid(pid)) return badRequest("Invalid collection pid");

    const range = parseTimeRange(req.nextUrl.searchParams);
    if (!range) return badRequest("Invalid time range");

    return getCollectionTaskHistory(pid, range);
  });
}
