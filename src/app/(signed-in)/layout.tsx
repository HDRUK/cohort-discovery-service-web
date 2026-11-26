import type { Metadata } from "next";
import RootDocument from "@/components/RootDocument";
import { ROOT_METADATA } from "@/config/metadata";

export const metadata: Metadata = ROOT_METADATA;

export default function SignedInLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <RootDocument>{children}</RootDocument>;
}
