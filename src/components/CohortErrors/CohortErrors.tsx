"use client";

import { Stack, Typography } from "@mui/material";
import ErrorIcon from "@/components/ErrorIcon";
import { Warning } from "@mui/icons-material";
import useStateManagement from "@/hooks/useStateManagement";
import useQueryBuilder from "@/hooks/useQueryBuilder";

const CohortErrors = () => {
  const {
    queryBuilderJson: { warnings = [] },
    errors,
  } = useQueryBuilder((qb) => ({
    queryBuilderJson: qb.queryBuilderJson,
    errors: qb.errors,
  }));

  const isLoading = useStateManagement((s) => s.isLoading);

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
