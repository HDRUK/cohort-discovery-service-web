"use client";

import { Box, Grid } from "@mui/material";
import SortButton from "@/components/SortButton";
import ControlledSearchBox from "@/modules/ControlledSearchBox";
import DomainFilterTabs from "./DomainFilterTabs";

const SORT_FIELDS = [
  { field: "concept_name", displayName: "Term Name", numeric: false },
  { field: "count", displayName: "Count", numeric: true },
];

const TermDirectoryToolbar = () => (
  <Box sx={{ px: 1 }}>
    <Grid
      container
      gap={1}
      sx={{ bgcolor: "table.main", p: 1, alignItems: "center" }}
    >
      <Grid size="grow">
        <ControlledSearchBox
          placeholder="Search by term name or OMOP ID..."
          submitOnChange
        />
      </Grid>
      <Grid size="auto">
        <SortButton fields={SORT_FIELDS} />
      </Grid>
    </Grid>
    <Box sx={{ pb: 1 }}>
      <DomainFilterTabs />
    </Box>
  </Box>
);

export default TermDirectoryToolbar;
