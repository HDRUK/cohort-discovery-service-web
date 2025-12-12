import { Workgroup } from "@/types/api";
import UpdateWorkgroup, {
  UpdateWorkgroupProps,
} from "@/modules/UpdateWorkgroup";
import { maskClientTest } from "@/lib/maskClientTest";
import { WorkgroupGuidanceProps } from "./WorkgroupsGuidance";

const WorkgroupGuidance = maskClientTest<WorkgroupGuidanceProps>(
  () => import("./WorkgroupsGuidance")
);

interface WorkgroupsRightPanelProps
  extends Omit<UpdateWorkgroupProps, "selectedWorkgroup"> {
  selectedWorkgroup: Workgroup | null;
}

const WorkgroupsRightPanel = ({
  selectedWorkgroup,
  ...props
}: WorkgroupsRightPanelProps) => {
  if (selectedWorkgroup) {
    return <UpdateWorkgroup selectedWorkgroup={selectedWorkgroup} {...props} />;
  }
  return <WorkgroupGuidance />;
};

export default WorkgroupsRightPanel;
