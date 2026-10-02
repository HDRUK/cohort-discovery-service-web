import {
  AvailableFormats,
  DOWNLOAD_TARGETS,
  DownloadTarget,
  isDownloadEntity,
} from "@/config/downloads";
import proxyDownload from "@/lib/downloadProxy";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ entity: string; pid?: string[] }> },
) {
  const { entity, pid } = await params;

  if (!isDownloadEntity(entity)) {
    return new Response("Unknown download", { status: 404 });
  }

  const target: DownloadTarget = DOWNLOAD_TARGETS[entity];
  const searchParams = new URL(req.url).searchParams;
  const format = (searchParams.get("format") ??
    target.formats[0]) as AvailableFormats;

  if (!target.formats.includes(format)) {
    return new Response("Unsupported format", { status: 400 });
  }

  if (pid && pid.length > 1) {
    return new Response("Unknown download", { status: 404 });
  }

  const [resourcePid = ""] = pid ?? [];

  if (target.requiresPid !== Boolean(resourcePid)) {
    return new Response("Unknown download", { status: 404 });
  }

  return proxyDownload({
    url: target.backendUrl(resourcePid, format),
    params: target.backendParams?.(searchParams),
    fallbackFilename: target.filename(resourcePid, format),
  });
}
