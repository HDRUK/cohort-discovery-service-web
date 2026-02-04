"use client";
import GuidanceModal from "@/components/GuidanceModal";
import { QUERY_BUILDER_GUIDANCE_COOKIE } from "@/config/internals";
import { maskClientTest } from "@/lib/maskClientTest";
import { ReactNode, useState } from "react";

const QueryBuilderGuidance = maskClientTest(
  () => import("./QueryBuilderGuidance"),
);

interface QueryBuilderGuidanceWrapperProps {
  initialShowGuidance: boolean;
  children: ReactNode;
}

const QueryBuilderGuidanceWrapper = ({
  initialShowGuidance,
  children,
}: QueryBuilderGuidanceWrapperProps) => {
  const [showGuidance, setShowGuidance] = useState(initialShowGuidance);

  const handleClose = () => {
    const maxAgeSeconds = 60 * 60 * 24 * 365;

    document.cookie = `${QUERY_BUILDER_GUIDANCE_COOKIE}=true; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax`;

    setShowGuidance(false);
  };

  if (showGuidance)
    return (
      <>
        <GuidanceModal
          open={showGuidance}
          onClose={handleClose}
        ></GuidanceModal>
        {children}
      </>
    ); //<QueryBuilderGuidance onClose={handleClose} />;

  return children;
};

export default QueryBuilderGuidanceWrapper;
