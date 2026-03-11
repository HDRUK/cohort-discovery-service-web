"use client";

import { Concept } from "@/types/api";
import { SearchBar } from "@hdruk/ui";
import {
  Dispatch,
  SetStateAction,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Box,
  Divider,
} from "@mui/material";
import { ConceptItem, ConceptItemProps } from "./ConceptItem";
import useUserStore from "@/hooks/useUserStore";
import useQueryBuilder from "@/hooks/useQueryBuilder";

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
  const searchForConcepts = useUserStore((s) => s.searchForConcepts);
  const includeSynthetic = useQueryBuilder((s) => s.includeSynthetic);

  const lastQueryRef = useRef<string>("");
  const initialSelectedRef = useRef<Record<number, boolean>>({
    ...(selected ?? {}),
  });

  const [options, setOptions] = useState<Concept[]>([]);

  const allSelected = useMemo(() => {
    if (options?.length === 0) return false;
    if (selected === undefined) return false;
    return options.every((o) => selected[o.concept_id] === true);
  }, [selected, options]);

  const toggleSelectAll = useCallback(() => {
    setSelected?.((prev) => {
      const next = { ...prev };
      options.forEach((o) => {
        next[o.concept_id] = !allSelected;
      });
      return next;
    });
  }, [options, allSelected, setSelected]);

  const onSearch = useCallback(
    async (value: string) => {
      if (value === lastQueryRef.current) return;
      lastQueryRef.current = value;

      if (!value) {
        setOptions([]);
        return;
      }

      setSelected?.({ ...initialSelectedRef.current });

      const { data } = await searchForConcepts(value, domain);
      setOptions((data as Concept[]) ?? []);
    },
    [domain, searchForConcepts, setSelected],
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

  const { nonSyntheticOptions, syntheticOptions, noOptionsFound } =
    useMemo(() => {
      const nonSynthetic: Concept[] = [];
      const synthetic: Concept[] = [];

      options.forEach((o) => {
        if (o.all_synthetic === 1 && includeSynthetic) {
          synthetic.push(o);
        } else if (o.all_synthetic === 0) {
          nonSynthetic.push(o);
        }
      });

      const noOptionsFound = nonSynthetic.length + synthetic.length === 0;

      return {
        nonSyntheticOptions: nonSynthetic,
        syntheticOptions: synthetic,
        noOptionsFound,
      };
    }, [options, includeSynthetic]);

  return (
    <Box>
      <SearchBar
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
        {multiple && options?.length > 0 && (
          <>
            <FormControlLabel
              key={"selectAll"}
              control={
                <Checkbox checked={allSelected} onChange={toggleSelectAll} />
              }
              label={"Select All"}
            />
            <Divider />
          </>
        )}
        {nonSyntheticOptions.length > 0 &&
          nonSyntheticOptions.map(renderConceptItem)}

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
    </Box>
  );
};

export default SearchConcepts;
