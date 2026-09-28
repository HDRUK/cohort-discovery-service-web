import { Suspense } from "react";
import TabsShell from "@/components/TabsShell";
import { notFound } from "next/navigation";
import { routes } from "@/config/routes";
import CollectionHostsTab, {
  CollectionHostsSkeleton,
} from "./components/CollectionHostTab";
import CollectionsTab, {
  CollectionsSkeleton,
} from "@/modules/CollectionsTab/CollectionsTab";
import { SearchParams } from "@/types/api";
import { getAccessToken } from "@/lib/auth";

type Params = Promise<{ custodianPid: string; tabId: string }>;

const CustodianAdminPage = async ({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) => {
  const { custodianPid, tabId } = await params;
  const apiSearchParams = await searchParams;

  const tabs = [
    {
      id: "hosts",
      label: "Hosts",
      href: routes.teamHosts(custodianPid),
      page: (
        <Suspense fallback={<CollectionHostsSkeleton />}>
          <CollectionHostsTab
            custodianPid={custodianPid}
            searchParams={apiSearchParams}
          />
        </Suspense>
      ),
    },
    {
      id: "collections",
      label: "Collections",
      href: routes.teamCollections(custodianPid),
      page: (
        <Suspense fallback={<CollectionsSkeleton />}>
          <CollectionsTab
            custodianPid={custodianPid}
            searchParams={apiSearchParams}
          />
        </Suspense>
      ),
    },
  ];

  const isValidTabId = (tabId: string) => tabs.some((t) => t.id === tabId);

  const token = await getAccessToken();

  if (!isValidTabId(tabId)) return notFound();

  return token && <TabsShell value={tabId} tabs={tabs} />;
};

export default CustodianAdminPage;
