import { MDXComponents } from "mdx/types";
import { ComponentType } from "react";
import { HelpVideo, HelpVideoMeta } from "@/types/help";
import { getYouTubeThumbnail } from "@/utils/youtube";

// Builds a renderable tutorial from a .mdx file's exported `meta` and default
// body component, deriving the thumbnails from the pasted YouTube link.
export const helpVideo = (
  id: string,
  meta: HelpVideoMeta,
  Body: ComponentType<{ components?: MDXComponents }>,
): HelpVideo => ({
  ...meta,
  id,
  Body,
  thumbnail: getYouTubeThumbnail(meta.youtube) ?? "",
  thumbnailFallback: getYouTubeThumbnail(meta.youtube, "hqdefault") ?? "",
});
