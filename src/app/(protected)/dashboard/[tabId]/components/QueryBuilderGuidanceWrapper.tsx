"use client";
import GuidanceModal from "@/components/GuidanceModal";
import { QUERY_BUILDER_GUIDANCE_COOKIE } from "@/config/internals";
import { ReactNode, useState } from "react";

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
        <GuidanceModal open={showGuidance} onClose={handleClose} showHeader />
        {children}
      </>
    );

  return children;
};

export default QueryBuilderGuidanceWrapper;
