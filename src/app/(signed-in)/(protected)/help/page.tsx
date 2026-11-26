import { routes } from "@/config/routes";
import { redirect } from "next/navigation";

export default function HelpOverview() {
  redirect(routes.help("overview"));
}
