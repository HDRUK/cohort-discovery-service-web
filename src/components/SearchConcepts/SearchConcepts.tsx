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
  useEffect,
} from "react";
import {
  FormControlLabel,
  FormGroup,
  Box,
  Divider,
  Button,
} from "@mui/material";
import SquareCheckbox from "@/components/SquareCheckbox";
import { ConceptItem, ConceptItemProps } from "./ConceptItem";
import useUserStore from "@/hooks/useUserStore";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import {
  DEFAULT_CODES_PER_PAGE,
  DEFAULT_SEARCH_RESULTS_MAX_HEIGHT,
} from "@/config/defaults";
import useFeatures from "@/hooks/useFeatures";
import { mergeSx } from "@/utils/helpers";

interface SlotProps {
  conceptItem: ConceptItemProps;
}

interface SearchConceptsProps {
  domain?: string;
  selected?: Record<number, boolean>;
  setSelected?: Dispatch<SetStateAction<Record<number, boolean>>>;
  multiple?: boolean;
  hideSelectAll?: boolean;
  onClick?: (concept: Concept) => void;
  onToggle?: (concept: Concept, isSelected: boolean) => void;
  onHasOptions?: (hasOptions: boolean) => void;
  headerSlot?: React.ReactNode;
  slotProps?: SlotProps;
}

const searchResultsSx = {
  alignItems: "stretch",
  flexDirection: "column",
  flexWrap: "nowrap",
  maxHeight: DEFAULT_SEARCH_RESULTS_MAX_HEIGHT,
  mt: 2,
  overflowX: "hidden",
  overflowY: "auto",
  pr: 1,
};

const SearchConcepts = ({
  domain,
  selected,
  setSelected,
  onClick,
  onToggle,
  onHasOptions,
  headerSlot,
  slotProps,
  multiple = false,
  hideSelectAll = false,
}: SearchConceptsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const searchForConcepts = useUserStore((s) => s.searchForConcepts);
  const includeSynthetic = useQueryBuilder(
    (qb) => qb.hasSelectedSyntheticDatasets,
  );

  const [perPage, setPerPage] = useState(DEFAULT_CODES_PER_PAGE);
  const [activeResult, setActiveResult] = useState<Paginated<
    Partial<Concept>
  > | null>(null);

  const lastQueryRef = useRef<string>("");
  const resultsContainerRef = useRef<HTMLDivElement | null>(null);
  const prevPerPageRef = useRef(0);
  const initialSelectedRef = useRef<Record<number, boolean>>({
    ...(selected ?? {}),
  });

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
        onToggle?.(o, !allSelected);
      });
      return next;
    });
  }, [visibleOptions, allSelected, setSelected, onToggle]);

  const onSearch = useCallback(
    async (value: string, force = false, customPerPage?: number) => {
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
        onHasOptions?.(false);
        return;
      }

      let effectivePerPage = perPage;

      if (isNewSearch) {
        effectivePerPage = DEFAULT_CODES_PER_PAGE;
        setPerPage(DEFAULT_CODES_PER_PAGE);
        setSelected?.({ ...initialSelectedRef.current });
      }

      if (customPerPage) {
        effectivePerPage = customPerPage;
      }

      setIsLoading(true);

      const res = await searchForConcepts({
        searchTerm: trimmedValue,
        perPage: effectivePerPage,
        domain,
      });

      const results = (res.data as Concept[]) ?? [];

      const nonSynthetic: Concept[] = [];
      const synthetic: Concept[] = [];

      results.forEach((o) => {
        const allSynthetic = o.all_synthetic ?? 0;
        if (allSynthetic === 1) {
          if (includeSynthetic) synthetic.push(o);
        } else {
          nonSynthetic.push(o);
        }
      });

      const hasVisibleOptions = nonSynthetic.length + synthetic.length > 0;

      setNonSyntheticOptions(nonSynthetic);
      setSyntheticOptions(synthetic);
      setNoOptionsFound(!hasVisibleOptions);
      setActiveResult(hasVisibleOptions ? res : null);
      setIsLoading(false);
      onHasOptions?.(hasVisibleOptions);
    },
    [
      domain,
      searchForConcepts,
      setSelected,
      includeSynthetic,
      perPage,
      onHasOptions,
    ],
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
        onToggle?.(c, !selected?.[c.concept_id]);
        e.stopPropagation();
        e.preventDefault();
      }}
      showCode
      showCounts={queryBuilderShowConceptStats}
    />
  );

  const handleShowMore = useCallback(() => {
    const nextPerPage =
      (activeResult?.per_page ?? perPage) + DEFAULT_CODES_PER_PAGE;
    setPerPage(nextPerPage);
    onSearch(lastQueryRef.current, true, nextPerPage);
  }, [activeResult, perPage, onSearch]);

  useEffect(() => {
    const current = activeResult?.per_page ?? 0;
    if (current > prevPerPageRef.current && prevPerPageRef.current > 0) {
      resultsContainerRef.current?.scrollTo?.({
        top: resultsContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
    prevPerPageRef.current = current;
  }, [activeResult?.per_page]);

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
      {headerSlot}
      <FormGroup
        ref={resultsContainerRef}
        data-testid="search-concepts-results"
        sx={mergeSx(searchResultsSx, { mt: headerSlot ? 0 : 2 })}
      >
        {multiple && !hideSelectAll && visibleOptions.length > 0 && (
          <>
            <FormControlLabel
              control={
                <SquareCheckbox checked={allSelected} onChange={toggleSelectAll} />
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
      </FormGroup>
      {activeResult && activeResult.per_page < activeResult.total && (
        <Box sx={{ mt: 1 }}>
          <Button
            variant="text"
            disabled={isLoading}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleShowMore();
            }}
          >
            Show more ({activeResult.per_page} / {activeResult.total})
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default SearchConcepts;
