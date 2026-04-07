import { Box } from "@mui/material";
import { useMemo } from "react";
import type { MRT_ColumnDef } from "material-react-table";
import { useTable } from "@/hooks/useTable";
import Table from "@/components/Table";
import { FieldConfigMap } from "@/hooks/useSaveChanges";

type DiffLeaf = { old: unknown; new: unknown };

export type ChangeRow = {
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
  if (Array.isArray(v)) {
    if (v.length === 0) return "—";
    if (v.every((x) => typeof x === "object" && x !== null && "label" in x)) {
      const labels = v
        .map((x) => (x as { label?: unknown }).label)
        .filter((l): l is string => typeof l === "string" && l.length > 0);

      const preview = labels.slice(0, 3).join(", ");
      const more = labels.length > 3 ? ` +${labels.length - 3} more` : "";
      return preview ? `${preview}${more}` : `${v.length} items`;
    }

    if (v.every((x) => ["string", "number", "boolean"].includes(typeof x))) {
      const preview = v.slice(0, 5).map(String).join(", ");
      const more = v.length > 5 ? ` +${v.length - 5} more` : "";
      return `${preview}${more}`;
    }

    return `${v.length} items`;
  }
  if (typeof v === "string") return v === "" ? "(empty)" : v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

type ChangesTableProps = {
  changed: unknown;
  fieldConfig?: FieldConfigMap;
};

export const ChangesTable = ({ changed, fieldConfig }: ChangesTableProps) => {
  const data = useMemo<ChangeRow[]>(() => flattenChanged(changed), [changed]);

  const columns = useMemo<MRT_ColumnDef<ChangeRow>[]>(
    () => [
      {
        id: "path",
        header: "Field",
        accessorFn: (row) => fieldConfig?.[row.path]?.label ?? row.path,
      },
      {
        id: "oldValue",
        header: "Old Value",
        Cell: ({ row, table }) =>
          fieldConfig?.[row.original.path]?.getValueLabel?.(
            row.original.oldValue,
            "oldValue",
            table,
          ) ?? formatValue(row.original.oldValue),
      },
      {
        id: "newValue",
        header: "New Value",
        Cell: ({ row, table }) =>
          fieldConfig?.[row.original.path]?.getValueLabel?.(
            row.original.newValue,
            "newValue",
            table,
          ) ?? formatValue(row.original.newValue),
      },
    ],
    [fieldConfig],
  );

  const table = useTable<ChangeRow>({
    columns,
    data,
    enableRowSelection: false,
    getRowId: (originalRow) => originalRow.path,
  });

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto" }}>
      <Table table={table} />
    </Box>
  );
};
