import { Paper, Skeleton } from "@mui/material";
import CollectionHostAdmin from "./components/CollectionHostAdmin";
import getCollectionHosts from "@/actions/getCollectionHosts";
import { Suspense } from "react";
import TabsShell from "@/components/TabsShell";
import CollectionAdmin from "./components/CollectionAdmin";
import CollectionHeader from "./components/CollectionHeader";
import getCustodianCollections from "@/actions/getCustodianCollections";

type Params = Promise<{ custodianPid: string }>;

const CustodianAdminPageContent = async ({ params }: { params: Params }) => {
  const { custodianPid } = await params;
  const { data: collectionHosts } = await getCollectionHosts(custodianPid);
  const { data: custodianCollections } = await getCustodianCollections(
    custodianPid
  );

  console.log(custodianCollections);

  return (
    <Paper
      sx={{
        p: 2,
        minHeight: "100%",
        width: "100%",
      }}
    >
      <CollectionHeader pid={custodianPid} />
      <TabsShell labels={["Hosts", "Collections"]}>
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
    </Paper>
  );
};

const CustodianAdminPage = async ({ params }: { params: Params }) => {
  return (
    <Suspense fallback={<Skeleton height={100} />}>
      <CustodianAdminPageContent params={params} />
    </Suspense>
  );
};

export default CustodianAdminPage;
