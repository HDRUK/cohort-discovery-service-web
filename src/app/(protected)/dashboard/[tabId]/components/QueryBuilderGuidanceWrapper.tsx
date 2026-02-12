"use client";
import GuidanceModal from "@/components/GuidanceModal";
import { QUERY_BUILDER_GUIDANCE_COOKIE } from "@/config/internals";
import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import useQueryBuilder from "@/hooks/useQueryBuilder";

interface QueryBuilderGuidanceWrapperProps {
  initialShowGuidance: boolean;
  children: ReactNode;
}

const QueryBuilderGuidanceWrapper = ({
  initialShowGuidance,
  children,
}: QueryBuilderGuidanceWrapperProps) => {
  const [showGuidance, setShowGuidance] = useState(initialShowGuidance);

  const router = useRouter();
  const { setHelpTooltipOpen } = useQueryBuilder((qb) => ({
    setHelpTooltipOpen: qb.setHelpTooltipOpen,
  }));

  const handleClose = () => {
    const maxAgeSeconds = 60 * 60 * 24 * 365;

    document.cookie = `${QUERY_BUILDER_GUIDANCE_COOKIE}=true; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax`;

    setShowGuidance(false);
    // Refresh the app router so server components re-read the cookie immediately
    router.refresh();

    setHelpTooltipOpen(true, 10000);
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
