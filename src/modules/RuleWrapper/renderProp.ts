import { ReactNode } from "react";

export type RenderProp<Args extends unknown[]> =
  ReactNode | ((...args: Args) => ReactNode);

export const resolveRenderProp = <Args extends unknown[]>(
  prop: RenderProp<Args>,
  ...args: Args
): ReactNode => (typeof prop === "function" ? prop(...args) : prop);
