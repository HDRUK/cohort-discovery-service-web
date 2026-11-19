import { maskClientTest } from "@/lib/maskClientTest";
import { WorkgroupGuidanceProps } from "./WorkgroupsGuidance";
import UpdateNetwork from "@/modules/UpdateNetwork";
import useSelectedNetwork from "@/hooks/useSelectedNetwork";

const NetworkGuidance = maskClientTest<WorkgroupGuidanceProps>(
  () => import("./WorkgroupsGuidance"),
);

const WorkgroupsRightPanel = () => {
  const selectedNetwork = useSelectedNetwork();

  if (selectedNetwork) {
    return <UpdateNetwork />;
  }
  return <NetworkGuidance />;
};

export default WorkgroupsRightPanel;
