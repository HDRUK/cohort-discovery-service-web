import { Suspense } from "react";
import TabsShell from "@/components/TabsShell";
import { notFound } from "next/navigation";
import { GATEWAY_TOKEN_NAME } from "@/config/internals";
import { cookies } from "next/headers";
import { routes } from "@/config/routes";
import CollectionsTab, {
  CollectionsSkeleton,
} from "./components/CollectionsTab";
import UsersTab, { UsersSkeleton } from "./components/UsersTab";
import WorkgroupsTab, { WorkgroupsSkeleton } from "./components/WorkgroupsTab";
import { SearchParams } from "@/types/api";

type Params = Promise<{ tabId: string }>;

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
    {
      id: "users",
      label: "Users",
      href: `${routes.admin}/users`,
      page: (
        <Suspense fallback={<UsersSkeleton />}>
          <UsersTab />
        </Suspense>
      ),
    },
    {
      id: "workgroups",
      label: "Workgroups",
      href: `${routes.admin}/workgroups`,
      page: (
        <Suspense fallback={<WorkgroupsSkeleton />}>
          <WorkgroupsTab />
        </Suspense>
      ),
    },
    {
      id: "collections",
      label: "Collections",
      href: `${routes.admin}/collections`,
      page: (
        <Suspense fallback={<CollectionsSkeleton />}>
          <CollectionsTab searchParams={apiSearchParams} />
        </Suspense>
      ),
    },
  ];

  const isValidTabId = (tabId: string) => TABS.some((t) => t.id === tabId);

  const cookieStore = await cookies();
  const token = cookieStore.get(GATEWAY_TOKEN_NAME)?.value;

  if (!isValidTabId(tabId)) return notFound();

  return token && <TabsShell value={tabId} tabs={TABS} />;
};

export default CustodianAdminPage;
