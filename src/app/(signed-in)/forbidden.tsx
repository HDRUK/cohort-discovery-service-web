import { Suspense } from "react";
import Custom403 from "./(error)/403/components/Custom403";

export default function Forbidden() {
  return (
    <Suspense>
      <Custom403 reason="missing-role" />
    </Suspense>
  );
}
