"use client";

import { useTable } from "@/hooks/useTable";
import { Collection } from "@/types/api";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { useMemo } from "react";

const Collections = ({ collections }: { collections: Collection[] }) => {
  const columns = useMemo<MRT_ColumnDef<Collection>[]>(
    () => [
      {
        id: "pid",
        header: "Id",
        accessorFn: (row) => row.pid,
        size: 20,
      },
      {
        id: "name",
        header: "Name",
        accessorFn: (row) => row.name,
        size: 20,
      },
      {
        id: "type",
        header: "Type",
        accessorFn: (row) => row.type,
        size: 20,
      },
      {
        id: "size",
        header: "Size",
        accessorFn: (row) =>
          row.demographics?.find((d) => d.name === "SEX")?.count,
        size: 20,
      },
      {
        id: "males",
        header: "Males",
        accessorFn: (row) =>
          row.demographics?.find((d) => d.name === "Male")?.count,
        size: 20,
      },
      {
        id: "females",
        header: "Females",
        accessorFn: (row) =>
          row.demographics?.find((d) => d.name === "Female")?.count,
        size: 20,
      },
    ],
    []
  );

  const table = useTable({
    columns,
    data: collections,
  });

  return <MaterialReactTable table={table} />;
};

export default Collections;
