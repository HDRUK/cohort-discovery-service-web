import { DomainTab } from "@/config/domainFilters";
import { API_ROUTES } from "@/lib/apiRoutes";
import proxyDownload from "@/lib/downloadProxy";
import { buildTermDirectoryParams } from "@/utils/buildTermDirectoryParams";

const TERM_DIRECTORY_EXPORT_PAGE = 1;
const TERM_DIRECTORY_EXPORT_PER_PAGE = 100;

interface DownloadTarget {
  formats: string[];
  requiresPid: boolean;
  backendUrl: (pid: string, format: string) => string;
  backendParams?: (searchParams: URLSearchParams) => URLSearchParams;
  filename: (pid: string, format: string) => string;
}

const DOWNLOAD_TARGETS: Record<string, DownloadTarget> = {
  queries: {
    formats: ["json", "csv"],
    requiresPid: true,
    backendUrl: (pid, format) => API_ROUTES.queryDownload(pid, format),
    filename: (pid, format) => `query-${pid}.${format}`,
  },
  "term-directory": {
    formats: ["csv"],
    requiresPid: false,
    backendUrl: () => API_ROUTES.termDirectoryDownload,
    backendParams: (searchParams) =>
      buildTermDirectoryParams(
        TERM_DIRECTORY_EXPORT_PAGE,
        TERM_DIRECTORY_EXPORT_PER_PAGE,
        searchParams.get("search_term") ?? undefined,
        (searchParams.get("domain") as DomainTab | null) ?? undefined,
        searchParams.get("collections")?.split(","),
        searchParams.get("sort") ?? undefined,
      ),
    filename: () => "term-directory-exported.csv",
  },
};

export async function GET(
  req: Request,
  { params }: { params: Promise<{ entity: string; pid?: string[] }> },
) {
  const { entity, pid } = await params;

  if (!Object.hasOwn(DOWNLOAD_TARGETS, entity)) {
    return new Response("Unknown download", { status: 404 });
  }

  const target = DOWNLOAD_TARGETS[entity];
  const searchParams = new URL(req.url).searchParams;
  const format = searchParams.get("format") ?? target.formats[0];

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
