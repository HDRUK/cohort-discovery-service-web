import getCustodian from "@/actions/custodian/getCustodian";
import CustodianPage from "./components/CustodianPage";
import getCustodianCollectionHosts from "@/actions/collectionHost/getCustodianCollectionHosts";

type Params = Promise<{ custodianPid: string }>;

const ProtectedCustodianPageLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) => {
  const { custodianPid } = await params;

  const { data: custodian } = await getCustodian(custodianPid);
  const { data: collectionHosts } =
    await getCustodianCollectionHosts(custodianPid);

  return (
    <CustodianPage custodian={custodian} collectionHosts={collectionHosts}>
      {children}
    </CustodianPage>
  );
};

export default ProtectedCustodianPageLayout;
