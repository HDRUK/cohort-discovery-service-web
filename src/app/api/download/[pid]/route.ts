import { getAccessToken } from "@/lib/auth";
const baseURL = process.env.API_BASE_URL!;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ pid: string }> },
) {
  const { pid } = await params;
  const urlObj = new URL(req.url);
  const format = urlObj.searchParams.get("format") ?? "csv";
  const entity = urlObj.searchParams.get("entity") ?? "queries";

  const token = await getAccessToken();

  const backendUrl = `${baseURL}/api/v1/${entity}/${pid}/download/${format}`;

  const backendRes = await fetch(backendUrl, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
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
