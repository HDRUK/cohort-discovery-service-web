const DOWNLOAD_ENTITIES = ["queries"] as const;
const DOWNLOAD_FORMATS = ["csv", "json"] as const;

export type DownloadEntity = (typeof DOWNLOAD_ENTITIES)[number];
export type DownloadFormat = (typeof DOWNLOAD_FORMATS)[number];

export interface DownloadParams {
  entity: DownloadEntity;
  format: DownloadFormat;
}

const isOneOf = <T extends string>(
  values: readonly T[],
  value: string,
): value is T => (values as readonly string[]).includes(value);

export const parseDownloadParams = (
  searchParams: URLSearchParams,
): DownloadParams | null => {
  const entity = searchParams.get("entity") ?? "queries";
  const format = searchParams.get("format") ?? "csv";

  if (!isOneOf(DOWNLOAD_ENTITIES, entity) || !isOneOf(DOWNLOAD_FORMATS, format))
    return null;

  return { entity, format };
};
