import { getTask } from "@/server/data/tasks";
import { badRequest, withSession } from "@/server/routeHandler";
import { isPid } from "@/utils/routeParams";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ pid: string }> },
) {
  return withSession(async () => {
    const { pid } = await params;
    if (!isPid(pid)) return badRequest("Invalid task pid");

    return getTask(pid);
  });
}
