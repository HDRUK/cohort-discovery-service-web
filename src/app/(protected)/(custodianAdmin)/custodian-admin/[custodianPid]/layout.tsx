import getCustodian from "@/actions/custodian/getCustodian";
import getCustodianCollectionHosts from "@/actions/collectionHost/getCustodianCollectionHosts";
import { CustodianSectionProvider } from "@/contexts/CustodianSectionContext";

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
    <CustodianSectionProvider
      custodian={custodian}
      collectionHosts={collectionHosts}
    >
      {children}
    </CustodianSectionProvider>
  );
};

export default ProtectedCustodianPageLayout;
