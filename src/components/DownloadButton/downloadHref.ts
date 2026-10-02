import { APP_API_ROUTES } from "@/lib/apiRoutes";

export enum AvailableFormats {
  JSON = "json",
  CSV = "csv",
}

export type DownloadEntity = "queries" | "term-directory";

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
  const searchParams = new URLSearchParams(params);
  searchParams.set("format", format);

  return `${APP_API_ROUTES.download(entity, pid)}?${searchParams.toString()}`;
};
