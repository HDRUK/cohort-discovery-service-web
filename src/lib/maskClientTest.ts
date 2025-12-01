import dynamic from "next/dynamic";
import type { ComponentType } from "react";

const isTest = process.env.NODE_ENV === "test";

export function maskClientTest<P>(
  importer: () => Promise<{ default: ComponentType<P> }>
): ComponentType<P> {
  if (isTest) {
    return (() => null) as ComponentType<P>;
  }

  return dynamic(importer, { ssr: false }) as ComponentType<P>;
}
