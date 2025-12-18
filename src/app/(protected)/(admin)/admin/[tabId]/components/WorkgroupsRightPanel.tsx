import UpdateWorkgroup, {
  UpdateWorkgroupProps,
} from "@/modules/UpdateWorkgroup";
import { maskClientTest } from "@/lib/maskClientTest";
import { WorkgroupGuidanceProps } from "./WorkgroupsGuidance";
import { useDaphneStore } from "@/store/useDaphneStore";

const WorkgroupGuidance = maskClientTest<WorkgroupGuidanceProps>(
  () => import("./WorkgroupsGuidance")
);

const WorkgroupsRightPanel = ({ ...props }: UpdateWorkgroupProps) => {
  const {
    adminData: { selectedWorkgroup },
  } = useDaphneStore();

  if (selectedWorkgroup) {
    return <UpdateWorkgroup {...props} />;
  }
  return <WorkgroupGuidance />;
};

export default WorkgroupsRightPanel;
