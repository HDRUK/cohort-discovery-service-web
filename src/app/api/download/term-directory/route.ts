import { DEFAULT_PER_PAGE } from "@/config/defaults";
import { DomainTab } from "@/config/domainFilters";
import { API_ROUTES } from "@/lib/apiRoutes";
import proxyDownload from "@/lib/downloadProxy";
import { buildTermDirectoryParams } from "@/utils/buildTermDirectoryParams";

export async function GET(req: Request) {
  const searchParams = new URL(req.url).searchParams;

  return proxyDownload({
    url: API_ROUTES.termDirectoryDownload,
    params: buildTermDirectoryParams(
      Number(searchParams.get("page")) || 1,
      Number(searchParams.get("per_page")) || DEFAULT_PER_PAGE,
      searchParams.get("search_term") ?? undefined,
      (searchParams.get("domain") as DomainTab | null) ?? undefined,
      searchParams.get("collections")?.split(","),
      searchParams.get("sort") ?? undefined,
    ),
    fallbackFilename: "term-directory-exported.csv",
  });
}
