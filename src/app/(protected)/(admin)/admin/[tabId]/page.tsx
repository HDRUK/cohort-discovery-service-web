import { Suspense } from "react";
import TabsShell from "@/components/TabsShell";
import { notFound } from "next/navigation";
import { ACCESS_TOKEN_NAME } from "@/config/internals";
import { cookies } from "next/headers";
import { routes } from "@/config/routes";
import CollectionsTab, {
  CollectionsSkeleton,
} from "@/modules/CollectionsTab/CollectionsTab";
import UsersTab, { UsersSkeleton } from "./components/UsersTab";
import WorkgroupsTab, { WorkgroupsSkeleton } from "./components/WorkgroupsTab";
import { SearchParams } from "@/types/api";
import { isStandalone } from "@/utils/modes";
import NetworksTab from "./components/NetworksTab";

type Params = Promise<{ tabId: string }>;

const applicationMode = process.env.APPLICATION_MODE;

const CustodianAdminPage = async ({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) => {
  const { tabId } = await params;
  const apiSearchParams = await searchParams;

  const TABS = [
    ...(isStandalone(applicationMode)
      ? [
          {
            id: "users",
            label: "Users",
            href: routes.adminUsers,
            page: (
              <Suspense fallback={<UsersSkeleton />}>
                <UsersTab applicationMode={applicationMode} />
              </Suspense>
            ),
          },
        ]
      : []),
    {
      id: "workgroups",
      label: "Workgroups",
      href: routes.adminWorkgroups,
      page: (
        <Suspense fallback={<WorkgroupsSkeleton />}>
          <WorkgroupsTab searchParams={apiSearchParams} />
        </Suspense>
      ),
    },
    {
      id: "collections",
      label: "Collections",
      href: routes.adminCollections,
      page: (
        <Suspense fallback={<CollectionsSkeleton />}>
          <CollectionsTab searchParams={apiSearchParams} />
        </Suspense>
      ),
    },
    {
      id: "networks",
      label: "Networks",
      href: routes.adminNetworks,
      page: (
        <Suspense fallback={<CollectionsSkeleton />}>
          <NetworksTab searchParams={apiSearchParams} />
        </Suspense>
      ),
    },
  ];

  const isValidTabId = (tabId: string) => TABS.some((t) => t.id === tabId);

  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_NAME)?.value;

  if (!isValidTabId(tabId)) return notFound();

  return token && <TabsShell value={tabId} tabs={TABS} />;
};

export default CustodianAdminPage;
