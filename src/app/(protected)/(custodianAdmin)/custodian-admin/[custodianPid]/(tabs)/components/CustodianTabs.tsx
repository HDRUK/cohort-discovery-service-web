"use client";

import { ReactNode } from "react";
import { useParams } from "next/navigation";
import SegmentTabsShell from "@/components/SegmentTabsShell";
import { routes } from "@/config/routes";

const CustodianTabs = ({ children }: { children: ReactNode }) => {
  const { custodianPid } = useParams<{ custodianPid: string }>();

  return (
    <SegmentTabsShell
      tabs={[
        { id: "hosts", label: "Hosts", href: routes.teamHosts(custodianPid) },
        {
          id: "collections",
          label: "Collections",
          href: routes.teamCollections(custodianPid),
        },
      ]}
    >
      {children}
    </SegmentTabsShell>
  );
};

export default CustodianTabs;
