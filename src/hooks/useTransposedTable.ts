import { useMemo } from "react";
import { MRT_ColumnDef } from "material-react-table";
import { useTable } from "@/hooks/useTable";

export interface TransposedTableRow {
  field: string;
  value: string | number | null;
}

type FormatterMap<T> = Partial<{
  [K in keyof T]: (value: T[K], data: T) => string | number | null;
}>;

type LabelMap<T> = Partial<{
  [K in keyof T]: string;
}>;

interface UseTransposedTableProps<T extends Record<string, any>> {
  data?: T | null;
  include?: (keyof T)[];
  exclude?: (keyof T)[];
  labels?: LabelMap<T>;
  formatters?: FormatterMap<T>;
}

export function useTransposedTable<T extends Record<string, any>>({
  data,
  include,
  exclude = [],
  labels = {},
  formatters = {},
}: UseTransposedTableProps<T>) {
  const tableData = useMemo<TransposedTableRow[]>(() => {
    if (!data) return [];

    const keys = (include ?? Object.keys(data)) as (keyof T)[];

    return keys
      .filter((key) => !exclude.includes(key))
      .map((key) => {
        const rawValue = data[key];
        const formatter = formatters[key];

        return {
          field: labels[key] ?? String(key),
          value: formatter ? formatter(rawValue, data) : (rawValue ?? null),
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
