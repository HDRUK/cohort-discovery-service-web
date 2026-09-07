"use client";

import { useState } from "react";
import { Box, Chip, Stack } from "@mui/material";
import { Concept } from "@/types/api";
import SearchConcepts from "@/components/SearchConcepts";
import ConceptChip from "@/components/ConceptChip";
import DemographicRow from "./DemographicRow";

interface DemographicConceptSectionProps {
  label: string;
  domain: string;
  concepts: Concept[];
  onToggle: (concept: Concept, selected: boolean) => void;
  onClear: () => void;
}

const toSelectedMap = (concepts: Concept[]): Record<number, boolean> =>
  Object.fromEntries(concepts.map((c) => [c.concept_id, true]));

const DemographicConceptSection = ({
  label,
  domain,
  concepts,
  onToggle,
  onClear,
}: DemographicConceptSectionProps) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Record<number, boolean>>({});
  const [draftConcepts, setDraftConcepts] = useState<Record<number, Concept>>(
    {},
  );

  const handleEditStart = () => {
    setDraft(toSelectedMap(concepts));
    setDraftConcepts(
      Object.fromEntries(concepts.map((c) => [c.concept_id, c])),
    );
    setEditing(true);
  };

  const handleDraftToggle = (concept: Concept, selected: boolean) => {
    setDraft((prev) => ({ ...prev, [concept.concept_id]: selected }));
    setDraftConcepts((prev) => ({ ...prev, [concept.concept_id]: concept }));
  };

  const handleSave = () => {
    const committedIds = new Set(concepts.map((c) => c.concept_id));
    const draftIds = new Set(
      Object.entries(draft)
        .filter(([, selected]) => selected)
        .map(([id]) => Number(id)),
    );

    concepts.forEach((concept) => {
      if (!draftIds.has(concept.concept_id)) onToggle(concept, false);
    });
    draftIds.forEach((id) => {
      if (!committedIds.has(id) && draftConcepts[id]) {
        onToggle(draftConcepts[id], true);
      }
    });

    setEditing(false);
  };

  const selectedChips = concepts.length > 0 && (
    <Stack direction="row" flexWrap="wrap" gap={0.5}>
      {concepts.map((c) => (
        <ConceptChip
          key={c.concept_id}
          concept={c}
          onDelete={(e) => {
            e.stopPropagation();
            onToggle(c, false);
          }}
        />
      ))}
    </Stack>
  );

  return (
    <DemographicRow
      label={label}
      editing={editing}
      disabled={false}
      hideActions={false}
      onEditStart={handleEditStart}
      onSave={handleSave}
      onReset={() => setEditing(false)}
      onClear={onClear}
      showClear={concepts.length > 0}
      renderEditing={
        <Box>
          <SearchConcepts
            domain={domain}
            multiple
            selected={draft}
            setSelected={setDraft}
            onToggle={handleDraftToggle}
          />
        </Box>
      }
    >
      {selectedChips || (
        <Chip variant="outlined" sx={{ bgcolor: "white" }} label="Any" />
      )}
    </DemographicRow>
  );
};

export default DemographicConceptSection;
