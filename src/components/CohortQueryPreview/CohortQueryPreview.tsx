"use client";

import { Stack, Typography } from "@mui/material";

import CohortErrors from "@/modules/CohortErrors";
import SubmitQueryButton from "@/components/SubmitQueryButton";

import useQueryBuilder from "@/hooks/useQueryBuilder";
import useFeatures from "@/hooks/useFeatures";
import {
  applyDemographicSubject,
  formatDemographicSubject,
} from "@/utils/demographicsText";
import ClearQueryButton from "@/components/ClearQueryButton";
import ShowJsonButton from "@/components/ShowJsonButton";

const CohortQueryPreview = () => {
  const warnings = useQueryBuilder((qb) => qb.queryBuilderJson.warnings ?? []);
  const queryAsText = useQueryBuilder((qb) => qb.queryAsText);
  const demographics = useQueryBuilder(
    (qb) => qb.queryBuilderJson.demographics,
  );

  const { queryBuilderUseDemographicRule } = useFeatures();

  const subject =
    queryBuilderUseDemographicRule && demographics
      ? formatDemographicSubject(demographics.age, demographics.sex)
      : null;
  const previewText = subject
    ? applyDemographicSubject(queryAsText, subject)
    : queryAsText;

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
        <Typography>{previewText}</Typography>
        <CohortErrors />
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
