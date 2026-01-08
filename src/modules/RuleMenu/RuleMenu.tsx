"use client";
import SkeletonFull from "@/components/SkeletonFull";
import dynamic from "next/dynamic";

// hack because https://github.com/vercel/next-plugins/issues/388
// - hard to transform mdx files to use in tests
// - pointless testing static data anyway..
const isTest = process.env.NODE_ENV === "test";

const Guidance = isTest
  ? () => null
  : dynamic(() => import("../Guidance"), { ssr: false, loading: () => <SkeletonFull/> });

const RuleMenu = () => {
  return <Guidance />;
};

export default RuleMenu;
