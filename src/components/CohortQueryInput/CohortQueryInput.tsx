"use client";

import { useForm, Controller, useWatch } from "react-hook-form";
import { Box } from "@mui/material";
import { useDaphneStore } from "@/store/useDaphneStore";
import { useCallback, useEffect, useRef } from "react";
import SearchBox from "../SearchBox";
import useQueryBuilder from "@/store/useQueryBuilder";
import {
  DEFAULT_SEARCH_WAIT_TIME,
  MAX_INVALID_REASONS,
} from "@/config/defaults";
import { useDebounce } from "@/hooks/useDebounce";
import useSubmitQuery from "@/hooks/useSubmitQuery";
import { ArrowForward } from "@mui/icons-material";
import { RuleErrors } from "@/utils/rules";

type FormValues = {
  cohortQueryInput: string;
};

const CohortQueryInput = () => {
  const {
    queryAsText,
    getQueryFromText,
    resetQueryBuilderJson,
    appendError,
    errors = [],
    warnings = [],
  } = useQueryBuilder((qb) => ({
    queryAsText: qb.queryAsText,
    getQueryFromText: qb.getQueryFromText,
    resetQueryBuilderJson: qb.resetQueryBuilderJson,
    appendError: qb.appendError,
    errors: qb.errors,
    warnings: qb.queryBuilderJson.warnings,
  }));

  const { submit: submitQuery, disabled } = useSubmitQuery();

  const isLoading = useDaphneStore((s) => s.stateManagement.isLoading);
  const setIsLoading = useDaphneStore((s) => s.stateManagement.setIsLoading);
  const lastCommittedRef = useRef<string>(queryAsText);

  const {
    handleSubmit: handleSubmitSearch,
    control,
    resetField,
    setError: setFormError,
    clearErrors: clearFormErrors,
    formState: { isDirty, isLoading: isLoadingForm, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      cohortQueryInput: queryAsText,
    },
  });

  const onSubmitSearch = useCallback(
    async ({ cohortQueryInput }: FormValues) => {
      const { rules } = await getQueryFromText(cohortQueryInput);
      if (rules.length === 0) {
        appendError(RuleErrors.NO_QUERY_FOUND);
      }
    },
    [getQueryFromText, appendError],
  );

  const liveQuery = useWatch({ control, name: "cohortQueryInput" }) ?? "";
  const debouncedQuery = useDebounce(
    liveQuery,
    DEFAULT_SEARCH_WAIT_TIME,
    (v) => v.trim() === "",
  );
  const debouncedQueryRef = useRef(debouncedQuery);

  const resetQuery = useCallback(() => {
    clearFormErrors();
    resetQueryBuilderJson(false);
    resetField("cohortQueryInput", {
      defaultValue: queryAsText,
      keepTouched: true,
      keepError: true,
    });
  }, [queryAsText, resetQueryBuilderJson, clearFormErrors, resetField]);

  useEffect(() => {
    debouncedQueryRef.current = debouncedQuery;
  }, [debouncedQuery]);

  useEffect(() => {
    clearFormErrors();
    resetField("cohortQueryInput", {
      defaultValue: errors.length > 0 ? debouncedQueryRef.current : queryAsText,
      keepTouched: true,
      keepError: true,
    });

    if (errors.length > 0) {
      setFormError("cohortQueryInput", {
        message:
          errors?.slice(0, MAX_INVALID_REASONS).join(" ") ||
          "This query is invalid...",
      });
    }
  }, [queryAsText, errors, resetField, setFormError, clearFormErrors]);

  useEffect(() => {
    if (isDirty || isLoadingForm || isSubmitting) setIsLoading(true);
    else setIsLoading(false);
  }, [setIsLoading, isDirty, isLoadingForm, isSubmitting]);

  useEffect(() => {
    const q = (debouncedQuery ?? "").trim();
    if (q === lastCommittedRef.current) return;
    lastCommittedRef.current = q;
    if (q === queryAsText) {
      if (q === "") resetQuery();
      return;
    }
    handleSubmitSearch(onSubmitSearch, resetQuery)();
  }, [
    queryAsText,
    debouncedQuery,
    handleSubmitSearch,
    onSubmitSearch,
    resetQuery,
  ]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmitSearch(onSubmitSearch, resetQuery)}
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
        rules={{
          required: "A Query string is required",
          minLength: {
            value: 3,
            message: "Query must be at least 3 characters",
          },
        }}
        render={({ field, fieldState: { error, isDirty } }) => (
          <SearchBox
            {...field}
            collapsible={false}
            error={isDirty ? false : !!error}
            type="search"
            placeholder="Search for a cohort e.g. females above 50 with diabetes type-ii"
            fullWidth
            variant="outlined"
            onClickEndAdornment={submitQuery}
            loading={isLoading}
            warning={warnings.length > 0}
            disabled={disabled || !!error}
            endIcon={<ArrowForward />}
          />
        )}
      />
    </Box>
  );
};

export default CohortQueryInput;
