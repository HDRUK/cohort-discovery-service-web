"use client";

import { Box, Grid, Paper } from "@mui/material";
import SelectDatasets from "@/components/SelectDatasets";
import QueryBuilder from "@/components/QueryBuilder";
import SubmitQueryButton from "@/components/SubmitQueryButton";
import { Field } from "react-querybuilder";
import { Collection } from "@/types/api";
import GuidancePanel from "./GuidancePanel";
import { useMemo, useState } from "react";

type Props = {
  fields: Field[];
  collections: Collection[];
  initialSelection: string[];
};

export default function CohortWorkbench({
  fields,
  collections,
  initialSelection,
}: Props) {
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);

  const centerCols = useMemo(() => {
    const left = leftOpen ? 3 : 0;
    const right = rightOpen ? 3 : 0;
    return Math.max(12 - left - right, 12 - 0 - 0);
  }, [leftOpen, rightOpen]);

  return (
    <>
      <Box sx={{ mx: "auto", width: "90%" }}>
        <SelectDatasets
          initialSelection={initialSelection}
          collections={collections}
        />
      </Box>

      <Grid
        container
        spacing={2}
        sx={{
          minHeight: "70vh",
        }}
      >
        <Grid size={2}>
          <Paper sx={{ p: 2 }}> Action menu..</Paper>
        </Grid>

        <Grid size={8}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              height: "100%",
            }}
          >
            <QueryBuilder fields={fields} />

            <Box
              sx={{
                display: "flex",
                justifyContent: "end",
                width: "100%",
                my: 2,
              }}
            >
              <SubmitQueryButton />
            </Box>
          </Paper>
        </Grid>

        <Grid size={2}>
          <Paper
            sx={{
              p: 2,
              top: 16,
            }}
          >
            <GuidancePanel
              qbRootSelector='[data-query-builder-root="true"]'
              qbSelector='[data-query-builder-id="{id}"]'
            />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
