import { getRegressionTests } from "@/server/data/regressionTests";
import { withSession } from "@/server/routeHandler";

export async function GET() {
  return withSession(() => getRegressionTests());
}
