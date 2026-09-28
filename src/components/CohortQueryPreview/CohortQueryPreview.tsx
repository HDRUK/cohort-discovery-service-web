"use client";

import { Skeleton, Stack, Typography } from "@mui/material";

import CohortErrors from "@/modules/CohortErrors";
import SubmitQueryButton from "@/components/SubmitQueryButton";

import useQueryBuilder from "@/hooks/useQueryBuilder";
import ClearQueryButton from "@/components/ClearQueryButton";
import ShowJsonButton from "@/components/ShowJsonButton";

const CohortQueryPreview = () => {
  const previewText = useQueryBuilder((qb) => qb.queryAsText);
  const warnings = useQueryBuilder((qb) => qb.queryBuilderJson.warnings ?? []);
  const isParsingQuery = useQueryBuilder((qb) => qb.isParsingQuery);

  return (
    <Stack
      gap={2}
      sx={{ p: 1 }}
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
      width="100%"
    >
      <Stack>
        {isParsingQuery ? (
          <Skeleton variant="text" width={240} sx={{ fontSize: "1rem" }} />
        ) : (
          <>
            <Typography>{previewText}</Typography>
            <CohortErrors />
          </>
        )}
      </Stack>
      <Stack gap={1} direction={"row"}>
        <ClearQueryButton />
        <SubmitQueryButton warning={warnings.length > 0} />
        <ShowJsonButton />
      </Stack>
    </Stack>
  );
};

export default CohortQueryPreview;
