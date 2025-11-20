import CollectionHostAdmin from "./components/CollectionHostAdmin";
import getCollectionHosts from "@/actions/getCollectionHosts";
import TabsShell from "@/components/TabsShell";
import CollectionAdmin from "./components/CollectionAdmin";
import getCustodianCollections from "@/actions/getCustodianCollections";
import { notFound } from "next/navigation";
import { GATEWAY_TOKEN_NAME } from "@/config/internals";
import { cookies } from "next/headers";
import { routes } from "@/config/routes";

type Params = Promise<{ custodianPid: string; tabId: string }>;

const CustodianAdminPage = async ({ params }: { params: Params }) => {
  const { custodianPid, tabId } = await params;
  const { data: collectionHosts } = await getCollectionHosts(custodianPid);
  const { data: custodianCollections } = await getCustodianCollections(
    custodianPid
  );

  const tabs = [
    { id: "hosts", label: "Hosts", href: routes.teamHosts(custodianPid) },
    {
      id: "collections",
      label: "Collections",
      href: routes.teamCollections(custodianPid),
    },
  ];

  const isValidTabId = (tabId: string) => tabs.some((t) => t.id === tabId);

  const cookieStore = await cookies();
  const token = cookieStore.get(GATEWAY_TOKEN_NAME)?.value;

  if (!isValidTabId(tabId)) return notFound();

  return (
    token && (
      <TabsShell initial={tabId} tabs={tabs}>
        <CollectionHostAdmin
          pid={custodianPid}
          collectionHosts={collectionHosts}
        />
        <CollectionAdmin
          pid={custodianPid}
          collectionHosts={collectionHosts}
          collections={custodianCollections}
        />
      </TabsShell>
    )
  );
};

export default CustodianAdminPage;
