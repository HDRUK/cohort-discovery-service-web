import { DomainTab } from "@/config/domainFilters";
import { API_ROUTES } from "@/lib/apiRoutes";
import proxyDownload from "@/lib/downloadProxy";
import { buildTermDirectoryParams } from "@/utils/buildTermDirectoryParams";

const EXPORT_PAGE = 1;
const EXPORT_PER_PAGE = 100;

export async function GET(req: Request) {
  const searchParams = new URL(req.url).searchParams;

  return proxyDownload({
    url: API_ROUTES.termDirectoryDownload,
    params: buildTermDirectoryParams(
      EXPORT_PAGE,
      EXPORT_PER_PAGE,
      searchParams.get("search_term") ?? undefined,
      (searchParams.get("domain") as DomainTab | null) ?? undefined,
      searchParams.get("collections")?.split(","),
      searchParams.get("sort") ?? undefined,
    ),
    fallbackFilename: "term-directory-exported.csv",
  });
}
