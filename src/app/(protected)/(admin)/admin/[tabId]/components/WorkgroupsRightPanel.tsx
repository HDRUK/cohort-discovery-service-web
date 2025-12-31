import UpdateWorkgroup, {
  UpdateWorkgroupProps,
} from "@/modules/UpdateWorkgroup";
import { maskClientTest } from "@/lib/maskClientTest";
import { WorkgroupGuidanceProps } from "./WorkgroupsGuidance";
import useAdminStore from "@/store/useAdminStore";

const WorkgroupGuidance = maskClientTest<WorkgroupGuidanceProps>(
  () => import("./WorkgroupsGuidance")
);

const WorkgroupsRightPanel = ({ ...props }: UpdateWorkgroupProps) => {
  const selectedWorkgroup = useAdminStore((s) => s.selectedWorkgroup);

  if (selectedWorkgroup) {
    return <UpdateWorkgroup {...props} />;
  }
  return <WorkgroupGuidance />;
};

export default WorkgroupsRightPanel;
