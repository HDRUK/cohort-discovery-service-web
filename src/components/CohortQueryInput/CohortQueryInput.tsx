"use client";

import { useForm, Controller, useWatch } from "react-hook-form";
import { Box, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import SearchBox from "../SearchBox";
import SearchIcon from "@mui/icons-material/Search";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import { useDebounce } from "@/hooks/useDebounce";
import {
  createOperator,
  createRuleGroup,
  findRulesWithAlternatives,
  getFirstTopLevelCombinator,
  RuleErrors,
} from "@/utils/rules";
import { EXAMPLES } from "@/config/queryExamples";
import { Query } from "@/types/api";
import SearchOverlay from "./SearchOverlay";
import { useDefaults } from "@/providers/DefaultProvider";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import InlineChoiceButton from "./InlineChoiceButton";
import { CombinatorType } from "@/types/rules";
import AddCircleIcon from "@mui/icons-material/AddCircle";

type FormValues = {
  cohortQueryInput: string;
};


enum QueryMode {
  FRESH = "fresh",
  APPEND = "append",
}

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
  const queryBuilderJson = useQueryBuilder((qb) => qb.queryBuilderJson);
  const setQueryBuilderJson = useQueryBuilder((qb) => qb.setQueryBuilderJson);
  const resetQueryBuilderJson = useQueryBuilder(
    (qb) => qb.resetQueryBuilderJson,
  );
  const includeSynthetic = useQueryBuilder(
    (qb) => qb.hasSelectedSyntheticDatasets,
  );
  const appendError = useQueryBuilder((qb) => qb.appendError);
  const select = useQueryBuilder((qb) => qb.select);
  const errors = useQueryBuilder((qb) => qb.errors ?? []);
  const warnings = useQueryBuilder((qb) => qb.queryBuilderJson.warnings ?? []);

  const queryClient = useQueryClient();

  const [queryMode, setQueryMode] = useState<QueryMode | null>(null);
  const [openSearchOverlap, setOpenSearchOverlap] = useState(false);

  const programmaticValueRef = useRef<string | null>(null);
  const lastSyncedQueryAsText = useRef<string | null>(null);
  const anchorRef = useRef<HTMLDivElement | null>(null);

  const {
    handleSubmit: handleSubmitSearch,
    control,
    resetField,
    setError: setFormError,
    clearErrors: clearFormErrors,
  } = useForm<FormValues>({
    defaultValues: {
      cohortQueryInput: syncFromQueryAsText ? queryAsText : "",
    },
    mode: "onChange",
  });

  const isAppendMode = queryMode === QueryMode.APPEND;

  const rulesKey = useMemo(
    () => JSON.stringify(queryBuilderJson.rules),
    [queryBuilderJson.rules],
  );
  const ruleCount = queryBuilderJson.rules.length;
  const requiresQueryModeChoice = !!ruleCount && queryMode === null;

  useEffect(() => {
    /*
     * Intentional exception to react-hooks/set-state-in-effect:
     * queryMode/openSearchOverlap are transient local UI states tied to the
     * current query builder contents.
     *
     * If the rules change outside this component (which they can do),
     * the previous mode may no longer be valid.
     * Resetting it forces the user back through the mode choice when
     * requiresQueryModeChoice becomes true.
     *
     * Functional setters prevent redundant updates if already reset.
     */
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQueryMode((current) => (current === null ? current : null));

    setOpenSearchOverlap((current) => (current ? false : current));
  }, [rulesKey]);

  const resetQuery = useCallback(() => {
    clearFormErrors();
    resetQueryBuilderJson(false);
    setQueryMode(null);
    setOpenSearchOverlap(false);

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
        queryKey: ["cohortRules", v, includeSynthetic],
        queryFn: () =>
          getQueryFromText(v, { ignoreSynthetic: !includeSynthetic }),
        staleTime: STALE_TIME,
      });
    },
    [getQueryFromText, queryClient, includeSynthetic],
  );

  const handleSearch = useCallback(
    async (raw: string) => {
      const parseQueryInput = (raw: string) => {
        const trimmed = raw.trim();

        const groupLevelCombinator = getFirstTopLevelCombinator(
          queryBuilderJson.rules,
        );

        const match = trimmed.match(/^(and|or)\b\s*/i);
        if (!match) {
          return {
            query: trimmed,
            combinator: groupLevelCombinator,
            convertToGroup: false,
          };
        }

        const requestedCombinator =
          match[1].toLowerCase() === "or"
            ? CombinatorType.OR
            : CombinatorType.AND;

        return {
          query: trimmed.slice(match[0].length).trim(),
          combinator: requestedCombinator,
          convertToGroup:
            queryBuilderJson.rules.length > 1 &&
            requestedCombinator !== groupLevelCombinator,
        };
      };

      if (requiresQueryModeChoice) return;

      const { query: q, combinator, convertToGroup } = parseQueryInput(raw);

      if (programmaticValueRef.current === q) return;
      if (q.length < MIN_SEARCH_LENGTH) return;

      if (q === queryAsText) {
        if (q === "") resetQuery();
        return;
      }

      const queryJson = await queryClient.fetchQuery({
        queryKey: ["cohortRules", q, includeSynthetic],
        queryFn: () =>
          getQueryFromText(q, { ignoreSynthetic: !includeSynthetic }),
        staleTime: STALE_TIME,
      });

      if (queryMode === QueryMode.APPEND) {
        const existingRules = convertToGroup
          ? [createRuleGroup(queryBuilderJson.rules)]
          : queryBuilderJson.rules;

        setQueryBuilderJson({
          ...queryBuilderJson,
          rules: [
            ...queryJson.rules,
            createOperator(combinator),
            ...existingRules,
          ],
          warnings: [
            ...(queryBuilderJson.warnings ?? []),
            ...(queryJson.warnings ?? []),
          ],
        });
      } else {
        setQueryBuilderJson(queryJson);
      }

      if (queryJson.rules.length === 0) {
        appendError(RuleErrors.NO_QUERY_FOUND);
      }

      const alternativeIds = findRulesWithAlternatives(queryJson.rules, 1);
      if (alternativeIds.length > 0) {
        select(alternativeIds[0]);
      }

      if (resetOnSearch) {
        resetField("cohortQueryInput", { defaultValue: "" });
      }

      setQueryMode(null);
      setOpenSearchOverlap(false);
    },
    [
      requiresQueryModeChoice,
      resetOnSearch,
      resetField,
      appendError,
      getQueryFromText,
      queryAsText,
      queryClient,
      resetQuery,
      setQueryBuilderJson,
      includeSynthetic,
      queryMode,
      queryBuilderJson,
      select,
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
    },
  );

  const showLoader = useIsFetching({ queryKey: ["cohortRules"] }) > 0;

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

  const onSubmit = useCallback(
    (e?: React.BaseSyntheticEvent) => {
      if (requiresQueryModeChoice) {
        e?.preventDefault?.();
        return;
      }

      return handleSubmitSearch(async ({ cohortQueryInput }) => {
        await handleSearch(cohortQueryInput);
        flushSearchedValue();
      }, resetQuery)(e);
    },
    [
      requiresQueryModeChoice,
      handleSubmitSearch,
      handleSearch,
      resetQuery,
      flushSearchedValue,
    ],
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
        render={({ field, fieldState: { error, isDirty } }) => {
          const hasInput = String(field.value ?? "").trim().length > 0;
          const showChoicePrompt = requiresQueryModeChoice && !hasInput;

          const searchDisabled = showChoicePrompt || !!error || !hasInput;

          const EndIcon = isAppendMode ? AddCircleIcon : ArrowForwardIcon;

          const endIconSx = {
            color: isAppendMode ? "success.main" : "inherit",
          };

          const showSearchOverlay =
            !showChoicePrompt && !isAppendMode && openSearchOverlap;

          return (
            <Box display="flex" flexDirection="row" sx={{ gap: 1 }}>
              <Box ref={anchorRef} sx={{ flex: 1 }}>
                <SearchBox
                  {...field}
                  startIcon={<SearchIcon fontSize="medium" sx={{ ml: 2 }} />}
                  collapsible={false}
                  error={isDirty && !!error}
                  type="search"
                  placeholders={placeholders}
                  placeholderOverride={
                    showChoicePrompt ? (
                      <Typography component="div">
                        Do you want to{" "}
                        <InlineChoiceButton
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setQueryMode(QueryMode.FRESH);
                            setOpenSearchOverlap(true);
                          }}
                        >
                          Start Fresh
                        </InlineChoiceButton>{" "}
                        or{" "}
                        <InlineChoiceButton
                          sx={{ px: 0.5 }}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setQueryMode(QueryMode.APPEND);
                            setOpenSearchOverlap(false);
                          }}
                        >
                          Add
                        </InlineChoiceButton>{" "}
                        to the existing query?
                      </Typography>
                    ) : undefined
                  }
                  fullWidth
                  variant="outlined"
                  loading={showLoader}
                  warning={warnings.length > 0}
                  readOnly={showChoicePrompt}
                  disabled={searchDisabled}
                  showEndIcon
                  endIcon={<EndIcon sx={endIconSx} />}
                  onClickEndAdornment={onSubmit}
                  onFocus={() => {
                    if (!showChoicePrompt && !isAppendMode) {
                      setOpenSearchOverlap(true);
                    }
                  }}
                  onBlur={() => {
                    field.onBlur();
                    setTimeout(() => setOpenSearchOverlap(false), 150);
                  }}
                  onChange={(e) => {
                    programmaticValueRef.current = null;

                    field.onChange(e);

                    if (e.target.value || isAppendMode) {
                      setOpenSearchOverlap(false);
                    }
                  }}
                />

                <SearchOverlay
                  queries={queries}
                  open={showSearchOverlay}
                  anchorEl={anchorRef.current}
                  options={placeholders.map((label) => ({
                    label,
                    value: EXAMPLES[label].id,
                    rules: EXAMPLES[label],
                  }))}
                />
              </Box>
            </Box>
          );
        }}
      />
    </Box>
  );
};

export default CohortQueryInput;
