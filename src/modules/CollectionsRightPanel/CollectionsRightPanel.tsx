import { Skeleton } from "@mui/material";
import { Suspense } from "react";
import UpdateCollection, {
  UpdateCollectionProps,
} from "@/modules/UpdateCollection";
import UpdateMultipleCollections from "../UpdateMultipleCollections";
import { maskClientTest } from "@/lib/maskClientTest";
import { CollectionGuidanceProps } from "./CollectionsGuidance";
import { useSelectionStore } from "@/store/selectionStore";
import { selectAllById } from "@/utils/selection";
import { useCollectionList } from "@/contexts/CollectionListContext";
import { useThreePane } from "@/providers/ThreePaneProvider";

const CollectionGuidance = maskClientTest<CollectionGuidanceProps>(
  () => import("./CollectionsGuidance"),
);

type CollectionsRightPanelProps = Omit<UpdateCollectionProps, "collection">;

const CollectionsRightPanel = (props: CollectionsRightPanelProps) => {
  const { expandedLeft } = useThreePane();
  const collections = useCollectionList()?.data;

  const selectedCollections = selectAllById(
    collections ?? [],
    useSelectionStore((s) => s.selectedCollectionIds),
  );
  const count = selectedCollections?.length ?? 0;

  if (expandedLeft) {
    return <CollectionGuidance creating />;
  }

  if (count === 1) {
    const [collection] = selectedCollections!;
    return (
      <Suspense fallback={<Skeleton variant="rectangular" height={300} />}>
        <UpdateCollection
          collection={collection}
          key={`update-coll-${collection.id}`}
          {...props}
        />
      </Suspense>
    );
  }

  if (count > 1) {
    return (
      <UpdateMultipleCollections
        collections={selectedCollections}
        key={JSON.stringify(selectedCollections.map((c) => c.id))}
        {...props}
      />
    );
  }

  return <CollectionGuidance creating={false} />;
};

export default CollectionsRightPanel;
