import { cookies } from "next/headers";
import { ACCESS_TOKEN_NAME } from "@/config/internals";
import { API_ROUTES, isPathSegment } from "@/lib/apiRoutes";
import { parseDownloadParams } from "@/utils/download";
const baseURL = process.env.API_BASE_URL!;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ pid: string }> },
) {
  const { pid } = await params;
  const downloadParams = parseDownloadParams(new URL(req.url).searchParams);
  if (!downloadParams || !isPathSegment(pid)) {
    return new Response("Unsupported download", { status: 400 });
  }
  const { entity, format } = downloadParams;

  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_NAME)?.value;
  if (!token) {
    return new Response("Not signed in", { status: 401 });
  }

  const backendUrl = `${baseURL}${API_ROUTES.download(entity, pid, format)}`;

  const backendRes = await fetch(backendUrl, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!backendRes.ok) {
    return new Response("Download failed", { status: backendRes.status });
  }

  const body = backendRes.body;

  const contentType =
    backendRes.headers.get("content-type") ?? "application/octet-stream";
  const contentDisposition =
    backendRes.headers.get("content-disposition") ??
    `attachment; filename="query-${pid}.${format}"`;

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": contentDisposition,
    },
  });
}
