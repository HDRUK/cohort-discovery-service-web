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

  const lastQueryRef = useRef<string>("");
  const initialSelectedRef = useRef<Record<number, boolean>>({
    ...(selected ?? {}),
  });

  const [options, setOptions] = useState<Concept[]>([]);
  const [noOptionsFound, setNoOptionsFound] = useState(false);

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
        setNoOptionsFound(false);
        return;
      }

      setSelected?.({ ...initialSelectedRef.current });

      const { data } = await searchForConcepts(value, domain);
      setOptions((data as Concept[]) ?? []);
      setNoOptionsFound(data?.length === 0);
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
        {options?.map((c) => (
          <ConceptItem
            {...(slotProps?.conceptItem ?? {})}
            multiple={multiple}
            key={c.concept_id}
            concept={c}
            isSelected={!!selected?.[c.concept_id]}
            handleClick={(id, e) => {
              onClick?.(c);
              handleToggle(id);
              e.stopPropagation();
              e.preventDefault();
            }}
          />
        ))}
      </FormGroup>
    </Box>
  );
};

export default SearchConcepts;
