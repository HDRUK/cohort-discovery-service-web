"use client";

import { useForm, Controller } from "react-hook-form";
import { Box } from "@mui/material";
import { useDaphneStore } from "@/store/useDaphneStore";
import { useEffect } from "react";
import SearchBox from "../SearchBox";
import useQueryBuilder from "@/store/useQueryBuilder";
import SubmitQueryButton from "../SubmitQueryButton";
import { RuleErrors } from "@/utils/rules";
import { MAX_INVALID_REASONS } from "@/config/defaults";

type FormValues = {
  cohortQueryInput: string;
  queryName: string;
};

const CohortQueryInput = () => {
  const { queryAsText, queryBuilderJson, getQueryFromText } = useQueryBuilder(
    (qb) => ({
      queryAsText: qb.queryAsText,
      queryBuilderJson: qb.queryBuilderJson,
      getQueryFromText: qb.getQueryFromText,
    })
  );
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

    if (!queryBuilderJson.valid) {
      //setValue("cohortQueryInput", "");

      const maskInitialError =
        queryBuilderJson?.invalidReason?.length === 1 &&
        queryBuilderJson?.invalidReason[0] === RuleErrors.EMPTY_RULE;

      if (!maskInitialError) {
        setError("cohortQueryInput", {
          message:
            queryBuilderJson?.invalidReason
              ?.slice(0, MAX_INVALID_REASONS)
              .join(" ") || "This query is invalid...",
        });
      }
      return;
    }
    setValue("cohortQueryInput", queryAsText);
  }, [
    queryAsText,
    queryBuilderJson.valid,
    queryBuilderJson.invalidReason,
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
            disabled={isLoading || !queryBuilderJson.valid}
            actionIcon={<SubmitQueryButton />}
          />
        )}
      />
    </Box>
  );
};

export default CohortQueryInput;
