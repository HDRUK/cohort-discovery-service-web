import { MDXComponents } from "mdx/types";
import { ComponentType } from "react";

export type HelpCategorisation = "Beginner" | "Advanced";

// Authored inside each tutorial .mdx file via `export const meta = {...}`.
export type HelpVideoMeta = {
  title: string;
  categorisation: HelpCategorisation;
  youtube: string;
};

// A tutorial ready to render: metadata plus the MDX body component and the
// embed/thumbnail URLs derived from `meta.youtube`.
export type HelpVideo = HelpVideoMeta & {
  id: string;
  Body: ComponentType<{ components?: MDXComponents }>;
  thumbnail: string;
  thumbnailFallback: string;
};

// The Overview tab is authored in overview.mdx (video embedded via <Video/>),
// so its meta only carries a title.
export type HelpOverviewMeta = {
  title: string;
};
