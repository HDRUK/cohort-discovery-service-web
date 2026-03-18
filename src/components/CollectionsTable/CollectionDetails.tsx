import getCollectionDetails from "@/actions/collection/getCollectionDetails";
import { useTable } from "@/hooks/useTable";
import {
  CollectionDetails as CollectionDetailsType,
  ResultFile,
} from "@/types/api";
import { Skeleton, Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { MRT_ColumnDef } from "material-react-table";
import { useMemo } from "react";
import Table from "../Table";
import { formatNumber } from "@/utils/numbers";
import { getDatetime } from "@/utils/date";
import { useTransposedTable } from "@/hooks/useTransposedTable";

const CollectionDetails = ({ pid }: { pid: string }) => {
  const { data: details, isLoading } = useQuery<CollectionDetailsType>({
    queryKey: ["collectionDetails", pid],
    queryFn: async () => {
      const res = await getCollectionDetails(pid);
      return res.data;
    },
    enabled: !!pid,
    staleTime: 60 * 1000,
  });

  const detailsTable = useTransposedTable<CollectionDetailsType>({
    data: details,
    include: ["created_at", "updated_at", "nconcepts"],
    labels: {
      created_at: "Created At",
      updated_at: "Updated At",
      nconcepts: "Number of Concepts",
    },
    formatters: {
      created_at: (value) => getDatetime(value),
      updated_at: (value) => getDatetime(value),
      nconcepts: (value) => formatNumber(value),
    },
  });

  const filesColumns = useMemo<MRT_ColumnDef<ResultFile>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "task.completed_at",
        header: "Completed At",
        accessorFn: (row) => getDatetime(row.created_at),
      },
      {
        accessorKey: "file_description",
        header: "Name",
      },
      {
        accessorKey: "rows_processed",
        header: "Rows Processed",
      },
      {
        accessorKey: "status",
        header: "Status",
      },
    ],
    [],
  );

  const filesTable = useTable<ResultFile>({
    enableRowSelection: false,
    columns: filesColumns,
    data: details?.result_files ?? [],
  });

  if (isLoading) return <Skeleton />;

  return (
    <Stack direction={"column"} gap={2}>
      <Table
        table={detailsTable}
        leftAction={{
          titleProps: {
            title: "Details",
            subTitle: pid,
          },
        }}
      />
      <Table
        table={filesTable}
        leftAction={{
          titleProps: {
            title: "Result Files",
            subTitle: pid,
          },
        }}
      />
    </Stack>
  );
};

export default CollectionDetails;
