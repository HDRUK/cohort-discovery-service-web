import { COLLECTION_METADATA_LABELS } from "@/config/conceptScan";
import { useTransposedTable } from "@/hooks/useTransposedTable";
import { CollectionDetails } from "@/types/api";
import { getDatetime } from "@/utils/date";
import Table from "../Table";

interface CollectionMetadataTableProps {
  pid: string;
  details: CollectionDetails;
}

const CollectionMetadataTable = ({ pid, details }: CollectionMetadataTableProps) => {
  const table = useTransposedTable<CollectionDetails>({
    data: details,
    include: ["created_at", "updated_at"],
    labels: COLLECTION_METADATA_LABELS,
    formatters: {
      created_at: (value) => getDatetime(value),
      updated_at: (value) => getDatetime(value),
    },
  });

  return (
    <Table
      table={table}
      leftAction={{
        titleProps: {
          title: "Details",
          subTitle: pid,
        },
      }}
    />
  );
};

export default CollectionMetadataTable;
