type Params = Promise<{ custodianPid: string }>;
const CustodianAdminPage = async ({ params }: { params: Params }) => {
  const { custodianPid } = await params;
  return <b> {custodianPid}</b>;
};

export default CustodianAdminPage;
