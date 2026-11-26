import { Suspense } from "react";
import Custom403 from "@/app/(error)/403/components/Custom403";

export default function AdminForbidden() {
  return (
    <Suspense>
      <Custom403 reason="no-admin-access" />
    </Suspense>
  );
}
