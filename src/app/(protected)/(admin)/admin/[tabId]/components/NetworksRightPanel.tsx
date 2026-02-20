import { maskClientTest } from "@/lib/maskClientTest";
import { WorkgroupGuidanceProps } from "./WorkgroupsGuidance";
import useAdminStore from "@/hooks/useAdminStore";
import UpdateNetwork, { UpdateNetworkProps } from "@/modules/UpdateNetwork";

const NetworkGuidance = maskClientTest<WorkgroupGuidanceProps>(
  () => import("./WorkgroupsGuidance"),
);

const WorkgroupsRightPanel = ({ ...props }: UpdateNetworkProps) => {
  const selectedNetwork = useAdminStore((s) => s.selectedNetwork);

  if (selectedNetwork) {
    return <UpdateNetwork {...props} />;
  }
  return <NetworkGuidance />;
};

export default WorkgroupsRightPanel;
