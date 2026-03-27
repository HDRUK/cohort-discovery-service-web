import { Collection } from "@/types/api";
import ManageMultipleCollectionsStatus from "../ManageMultipleCollectionsStatus";

interface ManageCollectionStatusProps {
  collection: Collection;
  expandedRight: boolean;
}

const ManageCollectionStatus = ({
  collection,
  expandedRight,
}: ManageCollectionStatusProps) => {
  return (
    <ManageMultipleCollectionsStatus
      collections={[collection]}
      expandedRight={expandedRight}
    />
  );
};

export default ManageCollectionStatus;
