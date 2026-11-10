import { ReactNode } from "react";
import SegmentTabsShell from "@/components/SegmentTabsShell";
import { routes } from "@/config/routes";

const CustodianTabs = async ({
  params,
  children,
}: {
  params: Promise<{ custodianPid: string }>;
  children: ReactNode;
}) => {
  const { custodianPid } = await params;

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
