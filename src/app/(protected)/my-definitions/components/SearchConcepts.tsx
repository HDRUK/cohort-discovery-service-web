"use client";

import { useDaphneStore } from "@/store/useDaphneStore";
import { Concept } from "@/types/api";
import { SearchBar } from "@hdruk/ui";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Box,
  Divider,
} from "@mui/material";
import { useCallback, useRef } from "react";

interface SearchConceptsProps {
  domain: string;
  selected: Record<number, boolean>;
  setSelected: Dispatch<SetStateAction<Record<number, boolean>>>;
}

const SearchConcepts = ({
  domain,
  selected,
  setSelected,
}: SearchConceptsProps) => {
  const {
    userData: { searchForConcepts },
  } = useDaphneStore();

  const lastQueryRef = useRef<string>("");
  const initialSelectedRef = useRef<Record<number, boolean>>({ ...selected });

  const [options, setOptions] = useState<Concept[]>([]);

  const allSelected = useMemo(() => {
    if (options.length === 0) return false;
    return options.every((o) => {
      const id = o?.concept_id;
      if (!id) return false;
      return selected[id] === true;
    });
  }, [selected, options]);

  const toggleSelectAll = useCallback(() => {
    setSelected((prev) => {
      const next = { ...prev };
      options.forEach((o) => {
        next[o.concept_id] = !allSelected;
      });

      return next;
    });
  }, [options, allSelected, setSelected]);

  const onSearch = useCallback(
    async (value: string) => {
      if (!value) return;
      if (value === lastQueryRef.current) return;
      lastQueryRef.current = value;
      setSelected({ ...initialSelectedRef.current });
      const { data } = await searchForConcepts(domain, value);
      if (data) {
        setOptions(data as Concept[]);
        return;
      }
    },
    [domain, searchForConcepts, setSelected]
  );

  const handleToggle = useCallback(
    (id: number) => {
      setSelected((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    },
    [setSelected]
  );

  return (
    <Box>
      <SearchBar onSearch={onSearch} />
      <FormGroup sx={{ mt: 2 }}>
        <FormControlLabel
          key={"selectAll"}
          control={
            <Checkbox
              checked={allSelected}
              onChange={() => toggleSelectAll()}
            />
          }
          label={"Select All"}
        />
        <Divider />
        {options?.map((o) => (
          <FormControlLabel
            key={o.concept_id}
            control={
              <Checkbox
                checked={!!selected[o.concept_id]}
                onChange={() => handleToggle(o.concept_id!)}
              />
            }
            label={`${o.description} [${o.concept_id}]`}
          />
        ))}
      </FormGroup>
    </Box>
  );
};

export default SearchConcepts;
