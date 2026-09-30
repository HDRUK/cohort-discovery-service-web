import { DomainTab } from "@/config/domainFilters";
import { cookies } from "next/headers";
import { ACCESS_TOKEN_NAME } from "@/config/internals";
import { buildTermDirectoryParams } from "@/utils/buildTermDirectoryParams";
import { API_ROUTES } from "@/lib/apiRoutes";
import { apiGet } from "@/lib/apiClient";
import { ApiResponse } from "@/types/api";

const baseURL = process.env.API_BASE_URL!;

export async function GET(req: Request) {
  const urlObj = new URL(req.url);
  const search_term = urlObj.searchParams.get("search_term") ?? undefined;
  const domain = urlObj.searchParams.get("domain") as DomainTab | undefined;
  const collections = urlObj.searchParams.get("collections") ?? undefined;
  const sort = urlObj.searchParams.get("sort") ?? undefined;

  const params = buildTermDirectoryParams(
    1,
    100,
    search_term,
    domain,
    collections?.split(","),
    sort,
  );

  const backendRes = (await apiGet({
    url: API_ROUTES.termDirectoryDownload,
    params,
  })) as Response;

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
