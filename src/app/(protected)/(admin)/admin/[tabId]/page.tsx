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

export const instant = false;

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
            page:
              tabId === "users" ? (
                <Suspense fallback={<UsersSkeleton />}>
                  <UsersTab applicationMode={applicationMode} />
                </Suspense>
              ) : (
                <UsersSkeleton />
              ),
          },
        ]
      : []),
    {
      id: "workgroups",
      label: "Workgroups",
      href: routes.adminWorkgroups,
      page:
        tabId === "workgroups" ? (
          <Suspense fallback={<WorkgroupsSkeleton />}>
            <WorkgroupsTab searchParams={apiSearchParams} />
          </Suspense>
        ) : (
          <WorkgroupsSkeleton />
        ),
    },
    {
      id: "collections",
      label: "Collections",
      href: routes.adminCollections,
      page:
        tabId === "collections" ? (
          <Suspense fallback={<CollectionsSkeleton />}>
            <CollectionsTab searchParams={apiSearchParams} />
          </Suspense>
        ) : (
          <CollectionsSkeleton />
        ),
    },
    {
      id: "networks",
      label: "Networks",
      href: routes.adminNetworks,
      page:
        tabId === "networks" ? (
          <Suspense fallback={<CollectionsSkeleton />}>
            <NetworksTab searchParams={apiSearchParams} />
          </Suspense>
        ) : (
          <CollectionsSkeleton />
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
