import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { routes } from "@/config/routes";
import { ACCESS_TOKEN_NAME } from "@/config/internals";
import { isStandalone } from "@/utils/modes";

const applicationMode = process.env.APPLICATION_MODE;

export default async function Home() {
  const token = (await cookies()).get(ACCESS_TOKEN_NAME);

  if (!token && isStandalone(applicationMode)) {
    redirect(routes.login);
  }

  redirect(routes.dashboardNewQuery());
}
