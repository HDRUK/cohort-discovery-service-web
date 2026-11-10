"use client";

import { ReactNode } from "react";
import { useSelectedLayoutSegment } from "next/navigation";
import TabsShell, { TabType } from "@/components/TabsShell";

export interface SegmentTabsShellProps {
  tabs: Omit<TabType, "page">[];
  children: ReactNode;
}

const SegmentTabsShell = ({ tabs, children }: SegmentTabsShellProps) => {
  const segment = useSelectedLayoutSegment();

  return (
    <TabsShell tabs={tabs} value={segment ?? tabs[0]?.id} forceValue>
      {children}
    </TabsShell>
  );
};

export default SegmentTabsShell;
