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

type Params = Promise<{ custodianPid: string; tabId: string }>;

const CustodianAdminPage = async ({ params }: { params: Params }) => {
  const { custodianPid, tabId } = await params;

  const tabs = [
    { id: "users", label: "Users", href: `${routes.admin}/users` },
    {
      id: "workgroups",
      label: "Workgroups",
      href: `${routes.admin}/workgroups`,
    },
    {
      id: "collections",
      label: "Collections",
      href: `${routes.admin}/collections`,
    },
  ];

  const isValidTabId = (tabId: string) => tabs.some((t) => t.id === tabId);

  const cookieStore = await cookies();
  const token = cookieStore.get(GATEWAY_TOKEN_NAME)?.value;

  if (!isValidTabId(tabId)) return notFound();

  return (
    token && (
      <TabsShell initial={tabId} tabs={tabs}>
        <Suspense fallback={<UsersSkeleton />}>
          <UsersTab />
        </Suspense>
        <Suspense fallback={<WorkgroupsSkeleton />}>
          <WorkgroupsTab />
        </Suspense>
        <Suspense fallback={<CollectionsSkeleton />}>
          <CollectionsTab />
        </Suspense>
      </TabsShell>
    )
  );
};

export default CustodianAdminPage;
