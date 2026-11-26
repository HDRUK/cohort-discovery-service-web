import { Suspense } from "react";
import Custom403 from "@/app/(error)/403/components/Custom403";

export default function CustodianForbidden() {
  return (
    <Suspense>
      <Custom403 reason="no-access-custodian" />
    </Suspense>
  );
}
