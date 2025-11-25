"use client";
import { ConceptSet } from "@/types/api";
import { useTable } from "@/hooks/useTable";
import { type MRT_ColumnDef } from "material-react-table";
import { useCallback, useEffect, useMemo } from "react";
import { Box, Grid } from "@mui/material";
import dayjs from "dayjs";
import ConceptTable from "./ConceptTable";
import AddNewConcept from "./AddNewConcept";
import { useDaphneStore } from "@/store/useDaphneStore";
import ActionDeleteButton from "@/components/ActionDeleteButton";
import CreateConceptSet from "@/modules/CreateConceptSet";
import Table from "@/components/Table";

const MyDefinitions = ({ conceptSets }: { conceptSets: ConceptSet[] }) => {
  const {
    userData: { removeConceptsFromSet, removeConceptSet, setConceptSets },
  } = useDaphneStore();

  useEffect(() => {
    setConceptSets(conceptSets);
  }, [conceptSets, setConceptSets]);

  const onDelete = useCallback(
    async (id: number) => removeConceptSet(id),
    [removeConceptSet]
  );

  const columns = useMemo<MRT_ColumnDef<ConceptSet>[]>(
    () => [
      {
        id: "name",
        header: "Name",
        accessorFn: (row) => row.name,
        size: 20,
      },
      {
        id: "description",
        header: "Description",
        accessorFn: (row) => row.description,
        size: 20,
      },
      {
        id: "domain",
        header: "Domain",
        accessorFn: (row) => row.domain,
        size: 20,
      },
      {
        id: "created_at",
        header: "Created",
        accessorFn: (row) =>
          row.created_at
            ? dayjs(row.created_at).format("MMM D, YYYY HH:mm")
            : "—",
      },
      {
        id: "updated_at",
        header: "Last Updated",
        accessorFn: (row) =>
          row.updated_at
            ? dayjs(row.updated_at).format("MMM D, YYYY HH:mm")
            : "—",
      },
      {
        id: "actions",
        header: "Actions",
        accessorFn: (row) => row.id,
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
    data: conceptSets,
    enableExpanding: true,
    initialState: {
      expanded: true,
    },
    renderDetailPanel: ({ row }) => (
      <Grid
        container
        spacing={2}
        sx={{
          p: 4,
          borderRadius: 4,
          border: 1,
          borderColor: "grey.300",
          backgroundColor: "#fff",
        }}
      >
        <Grid size={7}>
          <ConceptTable
            concepts={row.original.concepts}
            onDelete={(id) => removeConceptsFromSet(row.original.id, [id])}
          />
        </Grid>
        <Grid size={5}>
          <AddNewConcept conceptSet={row.original} />
        </Grid>
      </Grid>
    ),
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box>
        <CreateConceptSet />
      </Box>
      <Table table={table} />
    </Box>
  );
};

export default MyDefinitions;
