"use client";

import { Concept, Paginated } from "@/types/api";
import { SearchBar } from "@hdruk/ui";
import {
  Dispatch,
  SetStateAction,
  useState,
  useCallback,
  useRef,
  useMemo,
  useLayoutEffect,
} from "react";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Box,
  Divider,
  Button,
} from "@mui/material";
import { ConceptItem, ConceptItemProps } from "./ConceptItem";
import useUserStore from "@/hooks/useUserStore";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import { DEFAULT_CODES_PER_PAGE } from "@/config/defaults";
import useFeatures from "@/hooks/useFeatures";

interface SlotProps {
  conceptItem: ConceptItemProps;
}

interface SearchConceptsProps {
  domain?: string;
  selected?: Record<number, boolean>;
  setSelected?: Dispatch<SetStateAction<Record<number, boolean>>>;
  multiple?: boolean;
  onClick?: (concept: Concept) => void;
  slotProps?: SlotProps;
}

const SEARCH_RESULTS_MAX_HEIGHT = 420;

const SearchConcepts = ({
  domain,
  selected,
  setSelected,
  onClick,
  slotProps,
  multiple = false,
}: SearchConceptsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const searchForConcepts = useUserStore((s) => s.searchForConcepts);
  const includeSynthetic = useQueryBuilder(
    (qb) => qb.hasSelectedSyntheticDatasets,
  );

  const [activeResult, setActiveResult] = useState<Paginated<
    Partial<Concept>
  > | null>(null);

  const lastQueryRef = useRef<string>("");
  const resultsEndRef = useRef<HTMLDivElement | null>(null);
  const shouldScrollToResultsEndRef = useRef(false);
  const initialSelectedRef = useRef<Record<number, boolean>>({
    ...(selected ?? {}),
  });

  const [isShowingMore, setIsShowingMore] = useState(false);
  const [nonSyntheticOptions, setNonSyntheticOptions] = useState<Concept[]>([]);
  const [syntheticOptions, setSyntheticOptions] = useState<Concept[]>([]);
  const [noOptionsFound, setNoOptionsFound] = useState(false);

  const visibleOptions = useMemo(
    () => [...nonSyntheticOptions, ...syntheticOptions],
    [nonSyntheticOptions, syntheticOptions],
  );

  const allSelected =
    visibleOptions.length > 0 &&
    selected !== undefined &&
    visibleOptions.every((o) => selected[o.concept_id] === true);

  const toggleSelectAll = useCallback(() => {
    setSelected?.((prev) => {
      const next = { ...prev };
      visibleOptions.forEach((o) => {
        next[o.concept_id] = !allSelected;
      });
      return next;
    });
  }, [visibleOptions, allSelected, setSelected]);

  const onSearch = useCallback(
    async (value: string, force = false, page = 1, append = false) => {
      const trimmedValue = value.trim().length < 3 ? "" : value.trim();
      const isNewSearch = trimmedValue !== lastQueryRef.current;

      if (!force && !isNewSearch) return;

      lastQueryRef.current = trimmedValue;

      if (!trimmedValue) {
        setIsLoading(false);
        setActiveResult(null);
        setNonSyntheticOptions([]);
        setSyntheticOptions([]);
        setNoOptionsFound(false);
        return;
      }

      if (isNewSearch) {
        setSelected?.({ ...initialSelectedRef.current });
      }

      setIsLoading(true);

      try {
        const res = await searchForConcepts({
          searchTerm: trimmedValue,
          perPage: DEFAULT_CODES_PER_PAGE,
          page,
          domain,
        });

        const results = (res.data as Concept[]) ?? [];
        const nonSynthetic = results.filter((o) => o.all_synthetic !== 1);
        const synthetic = includeSynthetic
          ? results.filter((o) => o.all_synthetic === 1)
          : [];
        const hasVisibleOptions = nonSynthetic.length + synthetic.length > 0;

        if (append) {
          setNonSyntheticOptions((prev) => [...prev, ...nonSynthetic]);
          setSyntheticOptions((prev) => [...prev, ...synthetic]);
          setNoOptionsFound(false);
        } else {
          setNonSyntheticOptions(nonSynthetic);
          setSyntheticOptions(synthetic);
          setNoOptionsFound(!hasVisibleOptions);
        }

        setActiveResult(append || hasVisibleOptions ? res : null);
      } finally {
        setIsLoading(false);
      }
    },
    [domain, searchForConcepts, setSelected, includeSynthetic],
  );

  const handleToggle = useCallback(
    (id: number) => {
      setSelected?.((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    },
    [setSelected],
  );

  const { queryBuilderShowConceptStats } = useFeatures();

  const renderConceptItem = (c: Concept) => (
    <ConceptItem
      key={`${c.category}-${c.concept_id}`}
      {...(slotProps?.conceptItem ?? {})}
      multiple={multiple}
      concept={c}
      isSelected={!!selected?.[c.concept_id]}
      handleClick={(id, e) => {
        onClick?.(c);
        handleToggle(id);
        e.stopPropagation();
        e.preventDefault();
      }}
      showCode
      showCounts={queryBuilderShowConceptStats}
    />
  );

  const handleShowMore = useCallback(async () => {
    if (isLoading || isShowingMore || !activeResult) return;

    const nextPage = activeResult.current_page + 1;
    shouldScrollToResultsEndRef.current = true;
    setIsShowingMore(true);

    try {
      await onSearch(lastQueryRef.current, true, nextPage, true);
    } catch (error) {
      shouldScrollToResultsEndRef.current = false;
      setIsShowingMore(false);
      throw error;
    }
  }, [activeResult, onSearch, isLoading, isShowingMore]);

  // Scroll to the end of the results when new results are loaded via "Show more"
  useLayoutEffect(() => {
    if (!shouldScrollToResultsEndRef.current) return;

    shouldScrollToResultsEndRef.current = false;
    resultsEndRef.current?.scrollIntoView?.({
      block: "end",
      behavior: "smooth",
    });
    requestAnimationFrame(() => setIsShowingMore(false));
  }, [activeResult?.current_page, visibleOptions.length]);

  const loadedCount = activeResult?.to ?? visibleOptions.length;
  const hasMoreResults =
    activeResult &&
    activeResult.current_page < activeResult.last_page &&
    loadedCount < activeResult.total;

  return (
    <Box>
      <SearchBar
        placeholder="Term search..."
        loading={isLoading}
        onSearch={onSearch}
        filters={
          noOptionsFound ? (
            <Box sx={{ fontSize: 14, color: "text.secondary" }}>
              No options found
            </Box>
          ) : null
        }
        debounceMs={400}
      />
      <FormGroup
        data-testid="search-concepts-results"
        sx={{
          alignItems: "stretch",
          flexDirection: "column",
          flexWrap: "nowrap",
          maxHeight: SEARCH_RESULTS_MAX_HEIGHT,
          mt: 2,
          overflowX: "hidden",
          overflowY: "auto",
          pr: 1,
        }}
      >
        {multiple && visibleOptions.length > 0 && (
          <>
            <FormControlLabel
              control={
                <Checkbox checked={allSelected} onChange={toggleSelectAll} />
              }
              label="Select All"
            />
            <Divider />
          </>
        )}
        {nonSyntheticOptions.map(renderConceptItem)}
        {syntheticOptions.length > 0 && (
          <>
            <Box sx={{ my: 1.5 }}>
              <Divider sx={{ mb: 1 }} />
              <Box sx={{ fontSize: 13, color: "text.secondary", px: 1 }}>
                Concepts from synthetic collections
              </Box>
            </Box>
            {syntheticOptions.map(renderConceptItem)}
          </>
        )}
        <Box ref={resultsEndRef} aria-hidden />
      </FormGroup>
      {hasMoreResults && (
        <Box sx={{ mt: 1 }}>
          <Button
            variant="text"
            disabled={isLoading || isShowingMore}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleShowMore();
            }}
          >
            Show more ({loadedCount} / {activeResult.total})
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default SearchConcepts;
