import UpdateCollection, {
  UpdateCollectionProps,
} from "@/modules/UpdateCollection";
import { maskClientTest } from "@/lib/maskClientTest";
import { CollectionGuidanceProps } from "./CollectionsGuidance";
import useUserStore from "@/store/useUserStore";

const CollectionGuidance = maskClientTest<CollectionGuidanceProps>(
  () => import("./CollectionsGuidance")
);

type CollectionsRightPanelProps = Omit<UpdateCollectionProps, "collection">;

const CollectionsRightPanel = ({ ...props }: CollectionsRightPanelProps) => {
  const selectedCollection = useUserStore((u) => u.selectedCollection);

  if (selectedCollection) {
    return <UpdateCollection collection={selectedCollection} {...props} />;
  }
  return <CollectionGuidance />;
};

export default CollectionsRightPanel;
