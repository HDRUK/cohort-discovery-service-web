import getCustodian from "@/actions/getCustodian";
import CustodianPage from "./components/CustodianPage";

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

  return <CustodianPage custodian={custodian}>{children}</CustodianPage>;
};

export default ProtectedCustodianPageLayout;
