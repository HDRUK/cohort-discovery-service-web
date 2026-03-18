import { useMemo } from "react";
import { MRT_ColumnDef } from "material-react-table";
import { useTable } from "@/hooks/useTable";

export interface TransposedTableRow {
  field: string;
  value: string | number | null;
}

type FormatterMap<T extends object> = Partial<{
  [K in keyof T]: (value: T[K], data: T) => TransposedTableRow["value"];
}>;

type LabelMap<T extends object> = Partial<{
  [K in keyof T]: string;
}>;

interface UseTransposedTableProps<T extends object> {
  data?: T | null;
  include?: (keyof T)[];
  exclude?: (keyof T)[];
  labels?: LabelMap<T>;
  formatters?: FormatterMap<T>;
}

const toDisplayValue = (value: unknown): TransposedTableRow["value"] => {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    value === null
  ) {
    return value;
  }

  if (value === undefined) {
    return null;
  }

  return String(value);
};

export function useTransposedTable<T extends object>({
  data,
  include,
  exclude = [],
  labels = {},
  formatters = {},
}: UseTransposedTableProps<T>) {
  const tableData = useMemo<TransposedTableRow[]>(() => {
    if (!data) return [];

    const keys = (include ?? (Object.keys(data) as (keyof T)[])).filter(
      (key) => !exclude.includes(key),
    );

    return keys.map((key) => {
      const rawValue = data[key];
      const formatter = formatters[key];

      return {
        field: labels[key] ?? String(key),
        value: formatter ? formatter(rawValue, data) : toDisplayValue(rawValue),
      };
    });
  }, [data, include, exclude, labels, formatters]);

  const columns = useMemo<MRT_ColumnDef<TransposedTableRow>[]>(
    () => [
      {
        accessorKey: "field",
        header: "Field",
      },
      {
        accessorKey: "value",
        header: "Value",
      },
    ],
    [],
  );

  return useTable<TransposedTableRow>({
    enableRowSelection: false,
    columns,
    data: tableData,
  });
}
