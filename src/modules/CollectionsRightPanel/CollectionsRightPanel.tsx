import UpdateCollection, {
  UpdateCollectionProps,
} from "@/modules/UpdateCollection";
import UpdateMultipleCollections from "../UpdateMultipleCollections";
import { maskClientTest } from "@/lib/maskClientTest";
import { CollectionGuidanceProps } from "./CollectionsGuidance";
import useUserStore from "@/store/useUserStore";

const CollectionGuidance = maskClientTest<CollectionGuidanceProps>(
  () => import("./CollectionsGuidance")
);

type CollectionsRightPanelProps = Omit<UpdateCollectionProps, "collection">;

const CollectionsRightPanel = ({ ...props }: CollectionsRightPanelProps) => {
  const selectedCollections = useUserStore((u) => u.selectedCollections);

  if (selectedCollections && selectedCollections.length === 1) {
    return (
      <UpdateCollection
        collection={selectedCollections[0]}
        key={`update-coll-${selectedCollections[0].id}`}
        {...props}
      />
    );
  }
  if (selectedCollections && selectedCollections.length > 1) {
    return (
      <UpdateMultipleCollections
        collections={selectedCollections}
        key={JSON.stringify(selectedCollections.map((c) => c.id))}
        {...props}
      />
    );
  }
  return <CollectionGuidance />;
};

export default CollectionsRightPanel;
