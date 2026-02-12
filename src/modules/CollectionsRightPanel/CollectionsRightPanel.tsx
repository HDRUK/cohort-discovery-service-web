import UpdateCollection, {
  UpdateCollectionProps,
} from "@/modules/UpdateCollection";
import UpdateMultipleCollections from "../UpdateMultipleCollections";
import { maskClientTest } from "@/lib/maskClientTest";
import { CollectionGuidanceProps } from "./CollectionsGuidance";
import useUserStore from "@/hooks/useUserStore";

const CollectionGuidance = maskClientTest<CollectionGuidanceProps>(
  () => import("./CollectionsGuidance"),
);

type CollectionsRightPanelProps = Omit<UpdateCollectionProps, "collection">;

const CollectionsRightPanel = ({
  expandedLeft,
  ...props
}: CollectionsRightPanelProps) => {
  const selectedCollections = useUserStore((u) => u.selectedCollections);
  const count = selectedCollections?.length ?? 0;

  if (expandedLeft) {
    return <CollectionGuidance creating />;
  }

  if (count === 1) {
    const [collection] = selectedCollections!;
    return (
      <UpdateCollection
        collection={collection}
        key={`update-coll-${collection.id}`}
        expandedLeft={expandedLeft}
        {...props}
      />
    );
  }

  if (count > 1) {
    return (
      <UpdateMultipleCollections
        collections={selectedCollections}
        key={JSON.stringify(selectedCollections.map((c) => c.id))}
        expandedLeft={expandedLeft}
        {...props}
      />
    );
  }

  return <CollectionGuidance creating={false} />;
};

export default CollectionsRightPanel;
