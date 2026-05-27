"use client";

import { Concept } from "@/types/api";
import { Box, Button, Divider, Stack } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import SearchConcepts from "@/components/SearchConcepts";
import SelectedConceptsPanel from "@/components/SelectedConceptsPanel";

interface RuleSearchProps {
  onConfirm: (concept: Concept | Concept[]) => void;
}

const RuleSearch = ({ onConfirm }: RuleSearchProps) => {
  const [hasOptions, setHasOptions] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Record<number, boolean>>({});
  const [selectedConceptsMap, setSelectedConceptsMap] = useState<
    Record<number, Concept>
  >({});

  const selectedConcepts = useMemo(
    () => Object.values(selectedConceptsMap),
    [selectedConceptsMap],
  );

  const handleOnToggle = useCallback((concept: Concept, isSelected: boolean) => {
    setSelectedConceptsMap((prev) => {
      const next = { ...prev };
      if (isSelected) {
        next[concept.concept_id] = concept;
      } else {
        delete next[concept.concept_id];
      }
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setSelectedIds({});
    setSelectedConceptsMap({});
  }, []);

  const handleRemove = useCallback((concept: Concept) => {
    setSelectedIds((prev) => {
      const next = { ...prev };
      delete next[concept.concept_id];
      return next;
    });
    setSelectedConceptsMap((prev) => {
      const next = { ...prev };
      delete next[concept.concept_id];
      return next;
    });
  }, []);

  const handleConfirm = useCallback(() => {
    const clean = selectedConcepts.map(
      ({ alternatives: _omit, ...c }) => c as Concept,
    );
    if (clean.length === 1) {
      onConfirm(clean[0]);
    } else if (clean.length > 1) {
      onConfirm(clean);
    }
  }, [selectedConcepts, onConfirm]);

  return (
    <Box onClick={(e) => e.stopPropagation()}>
      <SearchConcepts
        multiple
        hideSelectAll
        selected={selectedIds}
        setSelected={setSelectedIds}
        onToggle={handleOnToggle}
        onHasOptions={setHasOptions}
      />
      {hasOptions && (
        <>
          <SelectedConceptsPanel
            concepts={selectedConcepts}
            onRemove={handleRemove}
            onClearAll={clearAll}
          />
          <Divider sx={{ mt: 1 }} />
          <Stack direction="row" justifyContent="flex-end" gap={1} pt={1}>
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                clearAll();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              disabled={selectedConcepts.length < 1}
              onClick={(e) => {
                e.stopPropagation();
                handleConfirm();
              }}
            >
              Confirm selection
            </Button>
          </Stack>
        </>
      )}
    </Box>
  );
};

export default RuleSearch;
