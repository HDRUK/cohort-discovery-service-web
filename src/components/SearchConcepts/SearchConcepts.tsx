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

  const [perPage, setPerPage] = useState(DEFAULT_CODES_PER_PAGE);
  const [activeResult, setActiveResult] = useState<Paginated<
    Partial<Concept>
  > | null>(null);

  const lastQueryRef = useRef<string>("");
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
      });
      return next;
    });
  }, [visibleOptions, allSelected, setSelected]);

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
    },
    [domain, searchForConcepts, setSelected, includeSynthetic, perPage],
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

  const handleShowMore = useCallback(() => {
    const nextPerPage =
      (activeResult?.per_page ?? perPage) + DEFAULT_CODES_PER_PAGE;
    setPerPage(nextPerPage);
    onSearch(lastQueryRef.current, true, nextPerPage);
  }, [activeResult, perPage, onSearch]);

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
      </FormGroup>
      {activeResult && activeResult.per_page < activeResult.total && (
        <Box sx={{ mt: 1 }}>
          <Button
            variant="text"
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
