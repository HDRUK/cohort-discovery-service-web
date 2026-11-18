import type { JSONSchemaDocument, JSONSchemaNode } from "@hdruk/gwdm-view";
import { routes } from "@/config/routes";
import { addQueryParam } from "@/utils/string";

interface CollectionLinkArgs {
  pid: string;
  url: string | null;
  queryPid: string;
  standalone: boolean;
}

export interface CollectionLink {
  href: string;
  external: boolean;
}

export const getCollectionLink = ({
  pid,
  url,
  queryPid,
  standalone,
}: CollectionLinkArgs): CollectionLink | null => {
  if (standalone) return { href: routes.collection(pid), external: false };
  if (!url) return null;
  return { href: addQueryParam(url, "ref", queryPid), external: true };
};

export const personalDataPaths = (
  node: JSONSchemaDocument | JSONSchemaNode,
  prefix = "",
): string[] =>
  Object.entries(
    (node.properties ?? {}) as Record<string, JSONSchemaNode>,
  ).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return child.personalData === true
      ? [path]
      : personalDataPaths(child, path);
  });
