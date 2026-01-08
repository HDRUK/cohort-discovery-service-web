import { routes } from "@/config/routes";
import { redirect } from "next/navigation";

export default function Dashboard() {
  redirect(routes.dashboardNewQuery());
}
