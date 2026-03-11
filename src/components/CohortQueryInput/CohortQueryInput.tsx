"use client";

import { useForm, Controller, useWatch } from "react-hook-form";
import { Box } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import SearchBox from "../SearchBox";
import SearchIcon from "@mui/icons-material/Search";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import { useDebounce } from "@/hooks/useDebounce";
import useSubmitQuery from "@/hooks/useSubmitQuery";
import { RuleErrors } from "@/utils/rules";
import { EXAMPLES } from "@/config/queryExamples";
import { Query } from "@/types/api";
import SearchOverlay from "./SearchOverlay";
import { useDefaults } from "@/providers/DefaultProvider";

type FormValues = {
  cohortQueryInput: string;
};

const MIN_SEARCH_LENGTH = 3;
const STALE_TIME = 60_000;

type CohortQueryInputProps = {
  queries: Query[];
  syncFromQueryAsText?: boolean;
  resetOnSearch?: boolean;
};

const CohortQueryInput = ({
  queries,
  syncFromQueryAsText = false,
  resetOnSearch = true,
}: CohortQueryInputProps) => {
  const defaults = useDefaults();

  const queryAsText = useQueryBuilder((qb) => qb.queryAsText);
  const getQueryFromText = useQueryBuilder((qb) => qb.getQueryFromText);
  const setQueryBuilderJson = useQueryBuilder((qb) => qb.setQueryBuilderJson);
  const resetQueryBuilderJson = useQueryBuilder(
    (qb) => qb.resetQueryBuilderJson,
  );
  const appendError = useQueryBuilder((qb) => qb.appendError);
  const errors = useQueryBuilder((qb) => qb.errors ?? []);
  const warnings = useQueryBuilder((qb) => qb.queryBuilderJson.warnings ?? []);

  const { disabled } = useSubmitQuery();
  const queryClient = useQueryClient();

  const programmaticValueRef = useRef<string | null>(null);

  const {
    handleSubmit: handleSubmitSearch,
    control,
    resetField,
    setError: setFormError,
    clearErrors: clearFormErrors,
    formState: { isDirty },
  } = useForm<FormValues>({
    defaultValues: { cohortQueryInput: queryAsText },
  });

  const resetQuery = useCallback(() => {
    clearFormErrors();
    resetQueryBuilderJson(false);
    resetField("cohortQueryInput", {
      defaultValue: syncFromQueryAsText ? queryAsText : "",
      keepTouched: true,
      keepError: true,
    });
  }, [
    clearFormErrors,
    resetQueryBuilderJson,
    resetField,
    queryAsText,
    syncFromQueryAsText,
  ]);

  const prefetchQuery = useCallback(
    (value: string) => {
      const v = value.trim();
      if (v.length < MIN_SEARCH_LENGTH) return;
      if (v === programmaticValueRef.current) return;

      queryClient.prefetchQuery({
        queryKey: ["cohortRules", v],
        queryFn: () => getQueryFromText(v),
        staleTime: STALE_TIME,
      });
    },
    [getQueryFromText, queryClient],
  );

  const handleSearch = useCallback(
    async (raw: string) => {
      const q = raw.trim();

      if (programmaticValueRef.current === q) return;
      if (q.length < MIN_SEARCH_LENGTH) return;

      if (q === queryAsText) {
        if (q === "") resetQuery();
        return;
      }

      const queryJson = await queryClient.fetchQuery({
        queryKey: ["cohortRules", q],
        queryFn: () => getQueryFromText(q),
        staleTime: STALE_TIME,
      });

      setQueryBuilderJson(queryJson);
      if (queryJson.rules.length === 0) {
        appendError(RuleErrors.NO_QUERY_FOUND);
      }
      if (resetOnSearch) resetField("cohortQueryInput", { defaultValue: "" });
    },
    [
      resetOnSearch,
      resetField,
      appendError,
      getQueryFromText,
      queryAsText,
      queryClient,
      resetQuery,
      setQueryBuilderJson,
    ],
  );

  const liveInput = useWatch({
    control,
    name: "cohortQueryInput",
    compute: (data: string) => data.trim(),
  });

  const shouldApplyImmediately = (v: string) => v.trim() === "";

  // debounce live input at a shorter interval to prefetch it
  useDebounce(liveInput, {
    delay: defaults.searchPrefetch,
    shouldApplyImmediately,
    onValueChange: prefetchQuery,
  });

  const { debounced: searchedValue, flush: flushSearchedValue } = useDebounce(
    liveInput,
    {
      delay: defaults.searchWaitTime,
      shouldApplyImmediately,
      onValueChange: handleSearch,
    },
  );

  const isTyping = isDirty ? liveInput !== searchedValue : false;

  const isFetchingCohortRules =
    useIsFetching({ queryKey: ["cohortRules"] }) > 0;

  const showLoader = isTyping || isFetchingCohortRules;

  const lastSyncedQueryAsText = useRef<string | null>(null);

  useEffect(() => {
    if (!syncFromQueryAsText) return;

    if (lastSyncedQueryAsText.current === queryAsText) return;
    lastSyncedQueryAsText.current = queryAsText;

    clearFormErrors();
    const nextValue = (errors.length > 0 ? searchedValue : queryAsText).trim();

    programmaticValueRef.current = nextValue;

    resetField("cohortQueryInput", {
      defaultValue: nextValue,
      keepDirty: false,
      keepTouched: true,
      keepError: true,
    });

    if (errors.length > 0) {
      setFormError("cohortQueryInput", {
        message:
          errors.slice(0, defaults.maxInvalidReasons).join(" ") ||
          "This query is invalid...",
      });
    }
  }, [
    syncFromQueryAsText,
    defaults,
    queryAsText,
    searchedValue,
    errors,
    resetField,
    setFormError,
    clearFormErrors,
  ]);

  const placeholders = Object.keys(EXAMPLES);
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  const onSubmit = useCallback(
    (e?: React.BaseSyntheticEvent) =>
      handleSubmitSearch(async ({ cohortQueryInput }) => {
        await handleSearch(cohortQueryInput);
        flushSearchedValue();
      }, resetQuery)(e),
    [handleSubmitSearch, handleSearch, resetQuery, flushSearchedValue],
  );

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{ width: "100%", overflow: "visible", py: 1 }}
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
                startIcon={<SearchIcon fontSize="medium" sx={{ ml: 2 }} />}
                collapsible={false}
                error={isDirty ? false : !!error}
                type="search"
                placeholders={placeholders}
                fullWidth
                variant="outlined"
                loading={showLoader}
                warning={warnings.length > 0}
                disabled={disabled || !!error}
                showEndIcon={false}
                onFocus={() => setOpen(true)}
                onBlur={() => {
                  field.onBlur();
                  setTimeout(() => setOpen(false), 150);
                }}
                onChange={(e) => {
                  programmaticValueRef.current = null;

                  field.onChange(e);
                  if (e.target.value) setOpen(false);
                }}
              />
              <SearchOverlay
                queries={queries}
                open={open}
                anchorEl={anchorRef.current}
                options={placeholders.map((label) => ({
                  label,
                  value: EXAMPLES[label].id,
                  rules: EXAMPLES[label],
                }))}
              />
            </Box>
          </Box>
        )}
      />
    </Box>
  );
};

export default CohortQueryInput;
