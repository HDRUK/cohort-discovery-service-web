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
  const segments = [encodeURIComponent(entity)];

  if (pid) segments.push(encodeURIComponent(pid));

  const searchParams = new URLSearchParams(params);
  searchParams.set("format", format);

  return `/api/download/${segments.join("/")}?${searchParams.toString()}`;
};
