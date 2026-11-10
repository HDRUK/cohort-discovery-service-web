import { ReactNode } from "react";
import { getCustodian } from "@/server/data/custodians";
import { getCustodianCollectionHosts } from "@/server/data/collectionHosts";
import { CustodianSectionProvider } from "@/contexts/CustodianSectionContext";

const CustodianSection = async ({
  params,
  children,
}: {
  params: Promise<{ custodianPid: string }>;
  children: ReactNode;
}) => {
  const { custodianPid } = await params;

  return (
    <CustodianSectionProvider
      custodian={getCustodian(custodianPid)}
      collectionHosts={getCustodianCollectionHosts(custodianPid)}
    >
      {children}
    </CustodianSectionProvider>
  );
};

export default CustodianSection;
