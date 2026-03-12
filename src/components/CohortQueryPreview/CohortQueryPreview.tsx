"use client";

import { Stack, Typography } from "@mui/material";

import CohortErrors from "@/modules/CohortErrors";
import SubmitQueryButton from "@/components/SubmitQueryButton";

import useQueryBuilder from "@/hooks/useQueryBuilder";
import ClearQueryButton from "../ClearQueryButton";

const CohortQueryPreview = () => {
  const warnings = useQueryBuilder((qb) => qb.queryBuilderJson.warnings ?? []);
  const queryAsText = useQueryBuilder((qb) => qb.queryAsText);

  return (
    <Stack
      sx={{ p: 1 }}
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
      width="100%"
    >
      <Stack>
        <Typography>{queryAsText}</Typography>
        <CohortErrors />
      </Stack>
      <Stack gap={1} direction={"row"}>
        <ClearQueryButton />
        <SubmitQueryButton warning={warnings.length > 0} />
      </Stack>
    </Stack>
  );
};

export default CohortQueryPreview;
