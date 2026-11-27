import type { Metadata } from "next";
import branding from "@branding/branding.config";

export const ROOT_METADATA: Metadata = {
  title: branding.productLongName,
  description: branding.description,
};
