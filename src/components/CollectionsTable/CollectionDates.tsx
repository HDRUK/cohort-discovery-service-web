import { COLLECTION_DATE_LABELS } from "@/config/conceptScan";
import { useTransposedTable } from "@/hooks/useTransposedTable";
import { CollectionDetails } from "@/types/api";
import { getDatetime } from "@/utils/date";
import Table from "../Table";

interface CollectionDatesProps {
  pid: string;
  details: CollectionDetails;
}

const CollectionDates = ({ pid, details }: CollectionDatesProps) => {
  const table = useTransposedTable<CollectionDetails>({
    data: details,
    include: ["created_at", "updated_at"],
    labels: COLLECTION_DATE_LABELS,
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

export default CollectionDates;
