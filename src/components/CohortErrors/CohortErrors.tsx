"use client";

import { Stack, Typography } from "@mui/material";
import useQueryBuilder from "@/store/useQueryBuilder";
import ErrorIcon from "@/components/ErrorIcon";
import { Warning } from "@mui/icons-material";
import { useDaphneStore } from "@/store/useDaphneStore";

const CohortErrors = () => {
  const {
    queryBuilderJson: { warnings = [] },
    errors,
  } = useQueryBuilder((qb) => ({
    queryBuilderJson: qb.queryBuilderJson,
    errors: qb.errors,
  }));
  const isLoading = useDaphneStore((s) => s.stateManagement.isLoading);
  if (isLoading) return null;
  return (
    <>
      {errors.length > 0 && (
        <Stack direction="row" gap={1} marginLeft={2}>
          <ErrorIcon />
          <Stack>
            {errors.map((error) => (
              <Typography key={error} variant="body1">
                {error}
              </Typography>
            ))}
            <Typography variant="body2" color="error">
              Please resolve errors to run the query
            </Typography>
          </Stack>
        </Stack>
      )}
      {warnings.length > 0 && (
        <Stack direction="row" gap={1} marginLeft={2}>
          <Warning color="warning" />
          <Stack>
            {warnings.map((warning) => (
              <Typography key={warning} variant="body1">
                {warning}
              </Typography>
            ))}
            <Typography variant="body2">
              Please review the query builder to validate the logic is intended
            </Typography>
          </Stack>
        </Stack>
      )}
    </>
  );
};

export default CohortErrors;
