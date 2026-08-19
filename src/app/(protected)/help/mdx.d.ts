// Tutorial .mdx files export their metadata via `export const meta = {...}`
// alongside the default MDX component. @types/mdx types only the default export
// and a second `declare module "*.mdx"` overwrites it, so the default is
// redeclared here (matching @types/mdx) with `meta` added.
declare module "*.mdx" {
  import type { Element, MDXProps } from "mdx/types";

  import type { HelpVideoMeta } from "@/types/help";

  export const meta: HelpVideoMeta;
  export default function MDXContent(props: MDXProps): Element;
}
