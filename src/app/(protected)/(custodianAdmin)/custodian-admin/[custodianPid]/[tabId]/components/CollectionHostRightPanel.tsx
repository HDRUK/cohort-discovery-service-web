import UpdateCollectionHost, {
  UpdateCollectionHostProps,
} from "@/modules/UpdateCollectionHost";
import { maskClientTest } from "@/lib/maskClientTest";
import { CollectionHostGuidanceProps } from "./CollectionHostGuidance";
import { CollectionHost } from "@/types/api";

const CollectionHostGuidance = maskClientTest<CollectionHostGuidanceProps>(
  () => import("./CollectionHostGuidance")
);

interface CollectionHostRightPanelProps
  extends Omit<UpdateCollectionHostProps, "selectedCollectionHost"> {
  selectedCollectionHost: CollectionHost | null;
}

const CollectionsRightPanel = ({
  selectedCollectionHost,
  expandedLeft,
  ...props
}: CollectionHostRightPanelProps) => {
  if (selectedCollectionHost) {
    return (
      <UpdateCollectionHost
        selectedCollectionHost={selectedCollectionHost}
        expandedLeft={expandedLeft}
        {...props}
      />
    );
  }
  return <CollectionHostGuidance creating={expandedLeft} />;
};

export default CollectionsRightPanel;
