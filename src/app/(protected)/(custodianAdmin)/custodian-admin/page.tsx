import { routes } from "@/config/routes";
import { SearchParams } from "@/types/api";
import { notFound, redirect } from "next/navigation";
import getCustodians from "@/actions/getCustodians";

export default async function CustodianAdmin({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { external_id: externalId } = await searchParams;
  const { data: custodians } = await getCustodians();

  const custodian = custodians.find(
    (c) => c.external_custodian_id === externalId
  );

  const { pid } = custodian || {};

  if (pid) redirect(routes.teamHome(pid));
  notFound();
}
