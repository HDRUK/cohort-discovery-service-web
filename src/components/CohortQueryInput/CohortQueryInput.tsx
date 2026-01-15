"use client";

import { useForm, Controller } from "react-hook-form";
import { Box, Stack } from "@mui/material";
import { useDaphneStore } from "@/store/useDaphneStore";
import { useEffect } from "react";
import SearchBox from "../SearchBox";
import useQueryBuilder from "@/store/useQueryBuilder";
import SubmitQueryButton from "../SubmitQueryButton";
import { MAX_INVALID_REASONS } from "@/config/defaults";
type FormValues = {
  cohortQueryInput: string;
  queryName: string;
};

const CohortQueryInput = () => {
  const {
    queryAsText,
    getQueryFromText,
    errors = [],
    warnings = [],
  } = useQueryBuilder((qb) => ({
    queryAsText: qb.queryAsText,
    getQueryFromText: qb.getQueryFromText,
    errors: qb.errors,
    warnings: qb.queryBuilderJson.warnings,
  }));

  const isLoading = useDaphneStore((s) => s.stateManagement.isLoading);

  const { handleSubmit, control, setValue, setError, clearErrors } =
    useForm<FormValues>({
      defaultValues: {
        cohortQueryInput: queryAsText,
        queryName: "",
      },
    });

  const onSubmit = (data: FormValues) => {
    getQueryFromText(data.cohortQueryInput);
  };

  useEffect(() => {
    clearErrors();

    if (errors.length > 0) {
      setError("cohortQueryInput", {
        message:
          errors?.slice(0, MAX_INVALID_REASONS).join(" ") ||
          "This query is invalid...",
      });
    }
    setValue("cohortQueryInput", queryAsText);
  }, [queryAsText, errors, setValue, setError, clearErrors]);

  const actions = [<SubmitQueryButton key="submitQueryButton" />];

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        width: "95%",
        overflow: "hidden",
        py: 1,
      }}
    >
      <Controller
        name="cohortQueryInput"
        control={control}
        defaultValue=""
        rules={{ required: "Query is required" }}
        render={({ field, fieldState: { error } }) => (
          <Stack gap={1}>
            <SearchBox
              {...field}
              collapsible={false}
              error={!!error}
              type="search"
              placeholder="Search for a cohort e.g. females above 50 with diabetes type-ii"
              fullWidth
              variant="outlined"
              onSubmit={handleSubmit(onSubmit)}
              loading={isLoading}
              warning={warnings.length > 0}
              disabled={isLoading || field.value.length < 3}
              actions={actions}
            />
          </Stack>
        )}
      />
    </Box>
  );
};

export default CohortQueryInput;
