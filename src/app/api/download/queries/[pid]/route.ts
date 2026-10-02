import { API_ROUTES } from "@/lib/apiRoutes";
import proxyDownload from "@/lib/downloadProxy";

const FORMATS = ["json", "csv"];

export async function GET(
  req: Request,
  { params }: { params: Promise<{ pid: string }> },
) {
  const { pid } = await params;
  const format = new URL(req.url).searchParams.get("format") ?? FORMATS[0];

  if (!FORMATS.includes(format)) {
    return new Response("Unsupported format", { status: 400 });
  }

  return proxyDownload({
    url: API_ROUTES.queryDownload(pid, format),
    fallbackFilename: `query-${pid}.${format}`,
  });
}
