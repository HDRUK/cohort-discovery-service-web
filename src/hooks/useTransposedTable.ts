import { useMemo } from "react";
import { MRT_ColumnDef } from "material-react-table";
import { useTable } from "@/hooks/useTable";

export interface TransposedTableRow {
  field: string;
  value: string | number | null | React.ReactNode;
}

type FormatterMap<T extends object> = Partial<{
  [K in keyof T]: (value: T[K], data: T) => TransposedTableRow["value"];
}>;

type LabelMap<T extends object> = Partial<{
  [K in keyof T]: string;
}>;

type ValueFormatter<T extends object> = (
  value: T[keyof T],
  key: keyof T,
  row: T,
) => React.ReactNode;

interface UseTransposedTableProps<T extends object> {
  data?: T | null;
  include?: (keyof T)[];
  exclude?: (keyof T)[];
  labels?: LabelMap<T>;
  formatters?: FormatterMap<T>;
  valueFormatter?: ValueFormatter<T>;
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
  valueFormatter,
}: UseTransposedTableProps<T>) {
  const tableData = useMemo<TransposedTableRow[]>(() => {
    if (!data) return [];

    const keys = (include ?? (Object.keys(data) as (keyof T)[])).filter(
      (key) => !exclude.includes(key),
    );

    return keys.map((key) => {
      const rawValue = data[key];
      const fieldFormatter = formatters[key];

      return {
        field: labels[key] ?? String(key),
        value: fieldFormatter
          ? fieldFormatter(rawValue, data)
          : valueFormatter
            ? valueFormatter(rawValue, key, data)
            : toDisplayValue(rawValue),
      };
    });
  }, [data, include, exclude, labels, formatters, valueFormatter]);

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
