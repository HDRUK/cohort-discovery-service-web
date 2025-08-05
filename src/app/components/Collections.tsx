"use client";
import { useDaphneStore } from "@/store/useDaphneStore";
import { Collection } from "@/types/api";

import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { useMemo } from "react";

const Collections = () => {
  const { collections } = useDaphneStore();
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

  const table = useMaterialReactTable({
    columns,
    data: collections,
    enablePagination: false,
    enableSorting: false,
    enableBottomToolbar: false,
    enableTopToolbar: false,
    enableColumnActions: false,
    enableColumnFilters: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableHiding: false,
    enableRowSelection: false,
    initialState: {
      density: "compact",
    },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: "secondary.main",
        color: "#fff",
        fontWeight: "bold",
      },
    },
  });

  return <MaterialReactTable table={table} />;
};

export default Collections;
