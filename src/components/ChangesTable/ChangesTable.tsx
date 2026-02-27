import { Box } from "@mui/material";
import { useMemo } from "react";
import type { MRT_ColumnDef } from "material-react-table";
import { useTable } from "@/hooks/useTable";
import Table from "@/components/Table";

type DiffLeaf = { old: unknown; new: unknown };

type ChangeRow = {
  path: string;
  oldValue: unknown;
  newValue: unknown;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function isDiffLeaf(v: unknown): v is DiffLeaf {
  return isRecord(v) && "old" in v && "new" in v && Object.keys(v).length === 2;
}

function flattenChanged(changed: unknown, prefix = ""): ChangeRow[] {
  if (!changed) return [];

  if (isDiffLeaf(changed)) {
    return [
      {
        path: prefix || "(root)",
        oldValue: changed.old,
        newValue: changed.new,
      },
    ];
  }
  if (Array.isArray(changed)) {
    return changed.flatMap((item, idx) => {
      const path = prefix ? `${prefix}.${idx}` : String(idx);
      return flattenChanged(item, path);
    });
  }

  if (isRecord(changed)) {
    return Object.entries(changed).flatMap(([key, val]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      return flattenChanged(val, path);
    });
  }

  return [];
}

function formatValue(v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (typeof v === "string") return v === "" ? "(empty)" : v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

export const ChangesTable = ({ changed }: { changed: unknown }) => {
  const data = useMemo<ChangeRow[]>(() => flattenChanged(changed), [changed]);

  const columns = useMemo<MRT_ColumnDef<ChangeRow>[]>(
    () => [
      {
        accessorKey: "path",
        header: "Field",
      },
      {
        accessorKey: "oldValue",
        header: "Old Value",
        accessorFn: (row) => formatValue(row.oldValue),
      },
      {
        accessorKey: "newValue",
        header: "New Value",
        accessorFn: (row) => formatValue(row.newValue),
      },
    ],
    [],
  );

  const table = useTable<ChangeRow>({
    columns,
    data,
    enableRowSelection: false,
  });

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto" }}>
      <Table table={table} />
    </Box>
  );
};
