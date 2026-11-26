import { routes } from "@/config/routes";
import { redirect } from "next/navigation";

type Params = Promise<{ custodianPid: string }>;
export default async function CustodianAdmin({ params }: { params: Params }) {
  const { custodianPid } = await params;
  redirect(routes.teamHosts(custodianPid));
}
