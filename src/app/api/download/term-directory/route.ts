import { cookies } from "next/headers";
import { ACCESS_TOKEN_NAME } from "@/config/internals";

const baseURL = process.env.API_BASE_URL!;

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_NAME)?.value;

  const backendUrl = `${baseURL}/api/v1/term-directory/download`;

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
    'attachment; filename="term-directory-exported.csv';

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": contentDisposition,
    },
  });
}
