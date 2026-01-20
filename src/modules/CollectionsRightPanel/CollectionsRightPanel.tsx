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

const CollectionsRightPanel = ({
  expandedLeft,
  ...props
}: CollectionsRightPanelProps) => {
  const selectedCollections = useUserStore((u) => u.selectedCollections);

  if (selectedCollections && selectedCollections.length === 1) {
    return (
      <UpdateCollection
        collection={selectedCollections[0]}
        key={`update-coll-${selectedCollections[0].id}`}
        expandedLeft={expandedLeft}
        {...props}
      />
    );
  }
  if (selectedCollections && selectedCollections.length > 1) {
    return (
      <UpdateMultipleCollections
        collections={selectedCollections}
        key={JSON.stringify(selectedCollections.map((c) => c.id))}
        expandedLeft={expandedLeft}
        {...props}
      />
    );
  }
  return <CollectionGuidance creating={expandedLeft} />;
};

export default CollectionsRightPanel;
