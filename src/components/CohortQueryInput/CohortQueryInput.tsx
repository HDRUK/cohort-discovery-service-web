"use client";

import { useForm, Controller } from "react-hook-form";
import { Box, Tooltip } from "@mui/material";
import { useDaphneStore } from "@/store/useDaphneStore";
import { useEffect, useMemo } from "react";
import SearchBox from "../SearchBox";
import useQueryBuilder from "@/store/useQueryBuilder";
import SubmitQueryButton from "../SubmitQueryButton";
import { RuleErrors } from "@/utils/rules";
import { MAX_INVALID_REASONS } from "@/config/defaults";
import { DatasetErrors } from "@/utils/datasets";

type FormValues = {
  cohortQueryInput: string;
  queryName: string;
};

const CohortQueryInput = () => {
  const { queryAsText, queryBuilderJson, getQueryFromText, selectedDatasets } =
    useQueryBuilder((qb) => ({
      queryAsText: qb.queryAsText,
      queryBuilderJson: qb.queryBuilderJson,
      getQueryFromText: qb.getQueryFromText,
      selectedDatasets: qb.selectedDatasets,
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

  const datasetsAreSelected = selectedDatasets.length > 0;

  const allErrors = useMemo(() => {
    const datasetReasons = datasetsAreSelected
      ? []
      : [DatasetErrors.NO_DATASETS];

    const qbReasons = queryBuilderJson.invalidReason ?? [];

    return {
      valid: queryBuilderJson.valid && datasetsAreSelected,
      invalidReason: [...datasetReasons, ...qbReasons],
    };
  }, [
    queryBuilderJson.valid,
    queryBuilderJson.invalidReason,
    datasetsAreSelected,
  ]);

  useEffect(() => {
    clearErrors();

    if (!allErrors.valid) {
      const maskInitialError =
        allErrors?.invalidReason?.length === 1 &&
        allErrors?.invalidReason[0] === RuleErrors.EMPTY_RULE;

      if (!maskInitialError) {
        setError("cohortQueryInput", {
          message:
            allErrors?.invalidReason?.slice(0, MAX_INVALID_REASONS).join(" ") ||
            "This query is invalid...",
        });
      }
      return;
    }
    setValue("cohortQueryInput", queryAsText);
  }, [
    queryAsText,
    allErrors.valid,
    allErrors.invalidReason,
    setValue,
    setError,
    clearErrors,
  ]);

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
          <Tooltip title={error?.message}>
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
              disabled={isLoading || !allErrors.valid}
              actionIcon={<SubmitQueryButton />}
            />
          </Tooltip>
        )}
      />
    </Box>
  );
};

export default CohortQueryInput;
