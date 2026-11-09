import UpdateCollectionHost, {
  UpdateCollectionHostProps,
} from "@/modules/UpdateCollectionHost";
import { maskClientTest } from "@/lib/maskClientTest";
import { CollectionHostGuidanceProps } from "./CollectionHostGuidance";
import { CollectionHost } from "@/types/api";
import { useThreePane } from "@/providers/ThreePaneProvider";

const CollectionHostGuidance = maskClientTest<CollectionHostGuidanceProps>(
  () => import("./CollectionHostGuidance"),
);

interface CollectionHostRightPanelProps extends Omit<
  UpdateCollectionHostProps,
  "selectedCollectionHost"
> {
  selectedCollectionHost: CollectionHost | null;
}

const CollectionsRightPanel = ({
  selectedCollectionHost,
  ...props
}: CollectionHostRightPanelProps) => {
  const { expandedLeft } = useThreePane();

  if (selectedCollectionHost) {
    return (
      <UpdateCollectionHost
        selectedCollectionHost={selectedCollectionHost}
        {...props}
      />
    );
  }
  return <CollectionHostGuidance creating={expandedLeft} />;
};

export default CollectionsRightPanel;
