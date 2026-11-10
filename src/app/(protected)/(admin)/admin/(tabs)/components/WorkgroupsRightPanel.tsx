import UpdateWorkgroup from "@/modules/UpdateWorkgroup";
import { maskClientTest } from "@/lib/maskClientTest";
import { WorkgroupGuidanceProps } from "./WorkgroupsGuidance";
import useAdminStore from "@/hooks/useAdminStore";

const WorkgroupGuidance = maskClientTest<WorkgroupGuidanceProps>(
  () => import("./WorkgroupsGuidance"),
);

const WorkgroupsRightPanel = () => {
  const selectedWorkgroup = useAdminStore((s) => s.selectedWorkgroup);

  if (selectedWorkgroup) {
    return <UpdateWorkgroup />;
  }
  return <WorkgroupGuidance />;
};

export default WorkgroupsRightPanel;
