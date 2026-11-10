import { parseQuery } from "@/server/data/queries";
import { badRequest, withSession } from "@/server/routeHandler";
import { parseParseQueryBody } from "@/utils/routeParams";

export async function POST(req: Request) {
  return withSession(async () => {
    const body = parseParseQueryBody(await req.json().catch(() => null));
    if (!body) return badRequest("Invalid query text");

    return parseQuery(body);
  });
}
