import { searchConcepts } from "@/server/data/concepts";
import { badRequest, withSession } from "@/server/routeHandler";
import { parseSearchConceptsBody } from "@/utils/routeParams";

export async function POST(req: Request) {
  return withSession(async () => {
    const body = parseSearchConceptsBody(await req.json().catch(() => null));
    if (!body) return badRequest("Invalid concept search");

    return searchConcepts(body);
  });
}
