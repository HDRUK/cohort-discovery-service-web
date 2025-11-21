"use client";
import dynamic from "next/dynamic";
import { GuidanceProps } from "./Guidance";

// hack because https://github.com/vercel/next-plugins/issues/388
// - hard to transform mdx files to use in tests
// - pointless testing static data anyway..
const isTest = process.env.NODE_ENV === "test";
const Guidance = isTest
  ? () => null
  : dynamic(() => import("./Guidance"), { ssr: false });

const GuidancePanel = (props: GuidanceProps) => {
  return <Guidance {...props} />;
};

export default GuidancePanel;
