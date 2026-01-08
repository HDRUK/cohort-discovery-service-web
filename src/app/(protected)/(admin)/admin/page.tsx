import { routes } from "@/config/routes";
import { redirect } from "next/navigation";

export default async function Admin() {
  redirect(routes.adminWorkgroups);
}
