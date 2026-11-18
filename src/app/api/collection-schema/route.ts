import { getCollectionSchema } from "@/server/data/collections";
import { ErrorMode } from "@/server/api";
import { withSession } from "@/server/routeHandler";

export async function GET() {
  return withSession(() =>
    getCollectionSchema({ errorMode: ErrorMode.RESULT }),
  );
}
