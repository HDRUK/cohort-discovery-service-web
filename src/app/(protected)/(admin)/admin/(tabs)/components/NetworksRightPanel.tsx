import { maskClientTest } from "@/lib/maskClientTest";
import { WorkgroupGuidanceProps } from "./WorkgroupsGuidance";
import useAdminStore from "@/hooks/useAdminStore";
import UpdateNetwork from "@/modules/UpdateNetwork";

const NetworkGuidance = maskClientTest<WorkgroupGuidanceProps>(
  () => import("./WorkgroupsGuidance"),
);

const WorkgroupsRightPanel = () => {
  const selectedNetwork = useAdminStore((s) => s.selectedNetwork);

  if (selectedNetwork) {
    return <UpdateNetwork />;
  }
  return <NetworkGuidance />;
};

export default WorkgroupsRightPanel;
