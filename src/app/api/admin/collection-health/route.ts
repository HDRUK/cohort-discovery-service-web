import { NextRequest } from "next/server";
import { collectionsParams } from "@/modules/CollectionHealth/healthCollections";
import { ErrorMode } from "@/server/api";
import { getAdminCollections } from "@/server/data/collections";
import { badRequest, withSession } from "@/server/routeHandler";
import { isPid } from "@/utils/routeParams";

export async function GET(req: NextRequest) {
  return withSession(async () => {
    const pid = req.nextUrl.searchParams.get("pid") ?? undefined;
    if (pid !== undefined && !isPid(pid)) {
      return badRequest("Invalid collection pid");
    }

    return getAdminCollections({
      params: collectionsParams(pid),
      errorMode: ErrorMode.RESULT,
    });
  });
}
