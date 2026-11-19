import { Skeleton } from "@mui/material";
import { Suspense } from "react";
import UpdateWorkgroup from "@/modules/UpdateWorkgroup";
import { maskClientTest } from "@/lib/maskClientTest";
import { WorkgroupGuidanceProps } from "./WorkgroupsGuidance";
import useSelectedWorkgroup from "@/hooks/useSelectedWorkgroup";

const WorkgroupGuidance = maskClientTest<WorkgroupGuidanceProps>(
  () => import("./WorkgroupsGuidance"),
);

const WorkgroupsRightPanel = () => {
  const selectedWorkgroup = useSelectedWorkgroup();

  if (selectedWorkgroup) {
    return (
      <Suspense fallback={<Skeleton variant="rectangular" height={300} />}>
        <UpdateWorkgroup />
      </Suspense>
    );
  }
  return <WorkgroupGuidance />;
};

export default WorkgroupsRightPanel;
