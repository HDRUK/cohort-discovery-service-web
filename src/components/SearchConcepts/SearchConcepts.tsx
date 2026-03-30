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
  const includeSynthetic = useQueryBuilder((s) => s.includeSynthetic);

  const [perPage, setPerPage] = useState(DEFAULT_CODES_PER_PAGE);
  const [activeResult, setActiveResult] =
    useState<Paginated<Partial<Concept>>>();

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
      const trimmedValue = value.trim();

      if (!force && trimmedValue === lastQueryRef.current) return;
      lastQueryRef.current = trimmedValue;

      if (!trimmedValue) {
        setIsLoading(false);
        setNonSyntheticOptions([]);
        setSyntheticOptions([]);
        setNoOptionsFound(false);
        return;
      }

      setIsLoading(true);
      setSelected?.({ ...initialSelectedRef.current });

      const effectivePerPage = customPerPage ?? perPage;

      const res = await searchForConcepts({
        searchTerm: trimmedValue,
        perPage: effectivePerPage,
        domain,
      });

      setActiveResult(res);
      const { data } = res;

      const results = (data as Concept[]) ?? [];

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

      setIsLoading(false);
      setNonSyntheticOptions(nonSynthetic);
      setSyntheticOptions(synthetic);
      setNoOptionsFound(nonSynthetic.length + synthetic.length === 0);
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

  const renderConceptItem = (c: Concept) => (
    <ConceptItem
      key={c.concept_id}
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
    />
  );

  const handleShowMore = useCallback(() => {
    const nextPerPage =
      (activeResult?.per_page ?? perPage) + DEFAULT_CODES_PER_PAGE;
    setPerPage(nextPerPage);
    onSearch(lastQueryRef.current, true, nextPerPage);
  }, [activeResult, perPage, setPerPage, onSearch]);

  return (
    <Box>
      <SearchBar
        loading={isLoading}
        onSearch={onSearch}
        filters={
          noOptionsFound ? (
            <Box sx={{ fontSize: 14, color: "text.secondary" }}>
              No options found
            </Box>
          ) : null
        }
      />
      <FormGroup sx={{ mt: 2 }}>
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
        {activeResult && activeResult.per_page < activeResult.total && (
          <Box>
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
      </FormGroup>
    </Box>
  );
};

export default SearchConcepts;
