"use client";
import { Stack } from "@mui/material";
import { Warning } from "@mui/icons-material";
import ErrorIcon from "@/components/ErrorIcon";
import useStateManagement from "@/hooks/useStateManagement";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import ExpandableIssueList from "../../components/ExpandableIssueList";

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
    <Stack ml={2}>
      <ExpandableIssueList
        title={`Error${errors.length > 1 ? "s" : ""}`}
        items={errors}
        color="error"
        icon={<ErrorIcon />}
      />

      <ExpandableIssueList
        title={`Warning${warnings.length > 1 ? "s" : ""}`}
        items={warnings}
        color="warning"
        icon={<Warning color="warning" />}
        helperText="Please review the query builder to validate the logic is intended"
      />
    </Stack>
  );
};

export default CohortErrors;
