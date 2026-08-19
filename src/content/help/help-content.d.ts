// Types the help tutorial .mdx modules so their `export const meta` block is
// checked against HelpVideoMeta at build time. This more specific pattern wins
// over the generic `*.mdx` declaration from @types/mdx, so the registry must
// import these files via the "@/content/help/..." alias for it to apply.
// Overview is authored differently (video in the body, no section/categorisation),
// so it gets its own meta shape. The exact path wins over the wildcard below.
declare module "@/content/help/overview.mdx" {
  import type { MDXComponents } from "mdx/types";
  import type { ComponentType } from "react";

  import type { HelpOverviewMeta } from "@/types/help";

  export const meta: HelpOverviewMeta;
  const MDXComponent: ComponentType<{ components?: MDXComponents }>;
  export default MDXComponent;
}

declare module "@/content/help/*.mdx" {
  import type { MDXComponents } from "mdx/types";
  import type { ComponentType } from "react";

  import type { HelpVideoMeta } from "@/types/help";

  export const meta: HelpVideoMeta;
  const MDXComponent: ComponentType<{ components?: MDXComponents }>;
  export default MDXComponent;
}
