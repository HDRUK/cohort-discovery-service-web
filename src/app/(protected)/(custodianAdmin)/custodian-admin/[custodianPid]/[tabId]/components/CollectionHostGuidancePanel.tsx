"use client";
import dynamic from "next/dynamic";
import { CollectionHostGuidanceProps } from "./CollectionHostGuidance";

// hack because https://github.com/vercel/next-plugins/issues/388
// - hard to transform mdx files to use in tests
// - pointless testing static data anyway..
const isTest = process.env.NODE_ENV === "test";
const Guidance = isTest
  ? () => null
  : dynamic(() => import("./CollectionHostGuidance"), { ssr: false });

const CollectionHostGuidancePanel = (props: CollectionHostGuidanceProps) => {
  return <Guidance {...props} />;
};

export default CollectionHostGuidancePanel;
