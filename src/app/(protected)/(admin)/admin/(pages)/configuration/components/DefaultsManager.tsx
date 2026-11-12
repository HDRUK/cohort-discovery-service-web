"use client";

import Table from "@/components/Table";
import { useTransposedTable } from "@/hooks/useTransposedTable";
import { useDefaults } from "@/providers/DefaultProvider";

export const DefaultsManager = () => {
  const defaults = useDefaults();

  const defaultsTable = useTransposedTable({
    data: defaults,
  });
  return (
    <Table
      table={defaultsTable}
      leftAction={{
        titleProps: {
          title: "Features",
          subTitle: "Defaults",
        },
      }}
    />
  );
};
