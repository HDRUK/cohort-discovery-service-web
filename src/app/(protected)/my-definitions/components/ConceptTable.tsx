"use client";
import { Concept } from "@/types/api";
import { useTable } from "@/hooks/useTable";
import { type MRT_ColumnDef } from "material-react-table";
import { useMemo } from "react";
import ActionDeleteButton from "@/components/ActionDeleteButton";
import Table from "@/components/Table";

interface ConceptTableProps {
  concepts: Concept[];
  onDelete: (id: number) => Promise<void>;
}

const ConceptTable = ({ concepts, onDelete }: ConceptTableProps) => {
  const columns = useMemo<MRT_ColumnDef<Concept>[]>(
    () => [
      {
        id: "concept_id",
        header: "OMOP Concept ID",
        accessorFn: (row) => row.concept_id,
        size: 20,
      },
      {
        id: "concept_description",
        header: "Description",
        accessorFn: (row) => row.description,
        size: 100,
      },
      {
        id: "concept_actions",
        header: "Actions",
        accessorFn: (row) => row.concept_id,
        Cell: ({ cell }) => {
          const id = cell.getValue<number>();
          return <ActionDeleteButton onDelete={() => onDelete(id)} />;
        },
        size: 20,
      },
    ],
    [onDelete]
  );

  const table = useTable({
    columns,
    data: concepts,
  });

  return <Table table={table} />;
};

export default ConceptTable;
