import { CollectionWithHosts } from "@/types/api";
import UpdateCollection, {
  UpdateCollectionProps,
} from "@/modules/UpdateCollection";
import { maskClientTest } from "@/lib/maskClientTest";
import { CollectionGuidanceProps } from "./CollectionsGuidance";

const CollectionGuidance = maskClientTest<CollectionGuidanceProps>(
  () => import("./CollectionsGuidance")
);

interface CollectionsRightPanelProps
  extends Omit<UpdateCollectionProps, "selectedCollection"> {
  selectedCollection: CollectionWithHosts | null;
}

const CollectionsRightPanel = ({
  selectedCollection,
  ...props
}: CollectionsRightPanelProps) => {
  if (selectedCollection) {
    return (
      <UpdateCollection selectedCollection={selectedCollection} {...props} />
    );
  }
  return <CollectionGuidance />;
};

export default CollectionsRightPanel;
