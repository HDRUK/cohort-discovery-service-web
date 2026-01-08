import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_TOKEN_NAME } from "@/config/internals";

export async function GET(_req: Request) {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN_NAME, "", {
    expires: new Date(0),
    path: "/",
  });

  redirect("/login");
}
