import { MDXComponents } from "mdx/types";
import { ComponentType } from "react";

// The URL slug for each tutorial section. These match the kebab-cased section
// titles and form the /help/<section> routes — do not change without updating
// any external links.
export type HelpSectionId =
  | "query-building-tutorials"
  | "results-tutorials"
  | "history-tutorials"
  | "collection-admin-tutorials";

export type HelpCategorisation = "Beginner" | "Advanced";

// Authored inside each tutorial .mdx file via `export const meta = {...}`.
export type HelpVideoMeta = {
  title: string;
  section: HelpSectionId;
  categorisation: HelpCategorisation;
  youtube: string;
};

// A tutorial ready to render: metadata plus the compiled MDX body and the
// embed/thumbnail URLs derived from `meta.youtube`.
export type HelpVideo = HelpVideoMeta & {
  id: string;
  Body: ComponentType<{ components?: MDXComponents }>;
  thumbnail: string;
  thumbnailFallback: string;
};

export type HelpSection = {
  id: HelpSectionId;
  title: string;
};

// The Overview tab is authored entirely in src/content/help/overview.mdx (video
// embedded in the body via <Video/>), so its meta only carries a title.
export type HelpOverviewMeta = {
  title: string;
};
