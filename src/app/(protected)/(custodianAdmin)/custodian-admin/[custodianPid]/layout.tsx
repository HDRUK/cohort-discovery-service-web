import getCustodian from "@/actions/custodian/getCustodian";
import getCustodianCollectionHosts from "@/actions/collectionHost/getCustodianCollectionHosts";
import { CustodianSectionProvider } from "@/contexts/CustodianSectionContext";
import { toCollectionHostSummary } from "@/utils/collectionHosts";

type Params = Promise<{ custodianPid: string }>;

const ProtectedCustodianPageLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) => {
  const { custodianPid } = await params;

  const [{ data: custodian }, { data: collectionHosts }] = await Promise.all([
    getCustodian(custodianPid),
    getCustodianCollectionHosts(custodianPid),
  ]);

  return (
    <CustodianSectionProvider
      custodian={custodian}
      collectionHosts={collectionHosts?.map(toCollectionHostSummary)}
    >
      {children}
    </CustodianSectionProvider>
  );
};

export default ProtectedCustodianPageLayout;
