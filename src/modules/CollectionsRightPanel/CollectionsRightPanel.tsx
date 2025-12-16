import UpdateCollection, {
  UpdateCollectionProps,
} from "@/modules/UpdateCollection";
import { maskClientTest } from "@/lib/maskClientTest";
import { CollectionGuidanceProps } from "./CollectionsGuidance";
import { useDaphneStore } from "@/store/useDaphneStore";

const CollectionGuidance = maskClientTest<CollectionGuidanceProps>(
  () => import("./CollectionsGuidance")
);

type CollectionsRightPanelProps = Omit<UpdateCollectionProps, "collection">;

const CollectionsRightPanel = ({ ...props }: CollectionsRightPanelProps) => {
  const {
    userData: { selectedCollection },
  } = useDaphneStore();

  if (selectedCollection) {
    return <UpdateCollection collection={selectedCollection} {...props} />;
  }
  return <CollectionGuidance />;
};

export default CollectionsRightPanel;
