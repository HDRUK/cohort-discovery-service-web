import { NextRequest } from "next/server";
import { ErrorMode } from "@/server/api";
import { getQueries } from "@/server/data/queries";
import { withSession } from "@/server/routeHandler";
import { parseQueryListParams } from "@/utils/routeParams";

export async function GET(req: NextRequest) {
  return withSession(() =>
    getQueries({
      params: parseQueryListParams(req.nextUrl.searchParams),
      errorMode: ErrorMode.RESULT,
    }),
  );
}
