"use client";

import { useForm, Controller, useWatch } from "react-hook-form";
import { Box } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import SearchBox from "../SearchBox";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import {
  DEFAULT_SEARCH_WAIT_TIME,
  MAX_INVALID_REASONS,
} from "@/config/defaults";
import { useDebounce } from "@/hooks/useDebounce";
import useSubmitQuery from "@/hooks/useSubmitQuery";
import { RuleErrors } from "@/utils/rules";
import useStateManagement from "@/hooks/useStateManagement";
import SubmitQueryButton from "@/components/SubmitQueryButton";
import { EXAMPLES } from "@/config/queryExamples";
import { Query } from "@/types/api";
import SearchOverlay from "./SearchOverlay";

type FormValues = {
  cohortQueryInput: string;
};

const CohortQueryInput = ({ queries }: { queries: Query[] }) => {
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

  const { disabled } = useSubmitQuery();

  const isLoading = useStateManagement((s) => s.isLoading);
  const setIsLoading = useStateManagement((s) => s.setIsLoading);

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

  const anchorRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <Box
      component="form"
      onSubmit={handleSubmitSearch(onSubmitSearch, resetQuery)}
      sx={{
        width: "95%",
        overflow: "visible",
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
          <Box display="flex" flexDirection="row" sx={{ gap: 1 }}>
            <Box ref={anchorRef} sx={{ flex: 1 }}>
              <SearchBox
                {...field}
                collapsible={false}
                error={isDirty ? false : !!error}
                type="search"
                placeholders={placeholders}
                fullWidth
                variant="outlined"
                loading={isLoading}
                warning={warnings.length > 0}
                disabled={disabled || !!error}
                showEndIcon={false}
                onFocus={() => {
                  setOpen(true);
                }}
                onBlur={() => {
                  field.onBlur();
                  setTimeout(() => setOpen(false), 150);
                }}
              />
              <SearchOverlay
                queries={queries}
                open={open}
                anchorEl={anchorRef.current}
              />
            </Box>
            <SubmitQueryButton warning={warnings.length > 0} />
          </Box>
        )}
      />
    </Box>
  );
};

export default CohortQueryInput;
