import { ReactNode } from "react";
import { forbidden } from "next/navigation";
import { getCurrentUser } from "@/server/data/user";
import { isCustodianMember } from "@/utils/user";
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
  const [{ custodianPid }, { data: me }] = await Promise.all([
    params,
    getCurrentUser(),
  ]);
  if (!isCustodianMember(me, custodianPid)) forbidden();

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
