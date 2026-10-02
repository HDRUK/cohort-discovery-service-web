import { DomainTab } from "@/config/domainFilters";
import { API_ROUTES } from "@/lib/apiRoutes";
import { buildTermDirectoryParams } from "@/utils/buildTermDirectoryParams";

export enum AvailableFormats {
  JSON = "json",
  CSV = "csv",
}

export const DOWNLOAD_NOTIFY_DURATION = 3000;

const TERM_DIRECTORY_EXPORT_PAGE = 1;
const TERM_DIRECTORY_EXPORT_PER_PAGE = 100;

export interface DownloadTarget {
  label: string;
  formats: AvailableFormats[];
  requiresPid: boolean;
  backendUrl: (pid: string, format: AvailableFormats) => string;
  backendParams?: (searchParams: URLSearchParams) => URLSearchParams;
  filename: (pid: string, format: AvailableFormats) => string;
}

export const DOWNLOAD_TARGETS = {
  queries: {
    label: "query",
    formats: [AvailableFormats.JSON, AvailableFormats.CSV],
    requiresPid: true,
    backendUrl: (pid, format) => API_ROUTES.queryDownload(pid, format),
    filename: (pid, format) => `query-${pid}.${format}`,
  },
  "term-directory": {
    label: "term directory",
    formats: [AvailableFormats.CSV],
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
} satisfies Record<string, DownloadTarget>;

export type DownloadEntity = keyof typeof DOWNLOAD_TARGETS;

export const isDownloadEntity = (value: string): value is DownloadEntity =>
  Object.hasOwn(DOWNLOAD_TARGETS, value);

export const downloadHref = ({
  entity,
  pid,
  format,
  params,
}: {
  entity: DownloadEntity;
  pid?: string;
  format: AvailableFormats;
  params?: string;
}): string => {
  const segments = [encodeURIComponent(entity)];

  if (pid) segments.push(encodeURIComponent(pid));

  const searchParams = new URLSearchParams(params);
  searchParams.set("format", format);

  return `/api/download/${segments.join("/")}?${searchParams.toString()}`;
};
