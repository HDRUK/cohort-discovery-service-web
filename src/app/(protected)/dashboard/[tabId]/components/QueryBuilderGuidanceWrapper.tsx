"use client";
import { QUERY_BUILDER_GUIDANCE_COOKIE } from "@/config/internals";
import { maskClientTest } from "@/lib/maskClientTest";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { ReactNode, useState } from "react";

const QueryBuilderGuidance = maskClientTest(
  () => import("./QueryBuilderGuidance")
);

interface QueryBuilderGuidanceWrapperProps {
  cookie: RequestCookie | undefined;
  children: ReactNode;
}

const QueryBuilderGuidanceWrapper = ({
  cookie,
  children,
}: QueryBuilderGuidanceWrapperProps) => {
  const initialShowGuidance = !cookie?.value;

  const [showGuidance, setShowGuidance] = useState(initialShowGuidance);

  const handleClose = () => {
    const maxAgeSeconds = 60 * 60 * 24 * 365;

    document.cookie = `${QUERY_BUILDER_GUIDANCE_COOKIE}=true; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax`;

    setShowGuidance(false);
  };

  if (showGuidance) return <QueryBuilderGuidance onClose={handleClose} />;

  return children;
};

export default QueryBuilderGuidanceWrapper;
