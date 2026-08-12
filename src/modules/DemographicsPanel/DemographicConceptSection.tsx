"use client";

import { useState } from "react";
import { Box, Button, Chip, Stack } from "@mui/material";
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
  const [selected, setSelected] = useState<Record<number, boolean>>({});

  const startEditing = () => {
    setSelected(toSelectedMap(concepts));
    setEditing(true);
  };

  const handleRemove = (concept: Concept) => {
    setSelected((prev) => ({ ...prev, [concept.concept_id]: false }));
    onToggle(concept, false);
  };

  const handleClear = () => {
    onClear();
    setEditing(false);
  };

  const selectedChips = concepts.length > 0 && (
    <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mt: editing ? 1 : 0 }}>
      {concepts.map((c) => (
        <ConceptChip
          key={c.concept_id}
          concept={c}
          onDelete={(e) => {
            e.stopPropagation();
            handleRemove(c);
          }}
        />
      ))}
    </Stack>
  );

  return (
    <DemographicRow
      label={label}
      onEdit={editing ? undefined : startEditing}
      onClear={handleClear}
      showClear={concepts.length > 0}
    >
      {editing ? (
        <Box>
          <SearchConcepts
            domain={domain}
            multiple
            selected={selected}
            setSelected={setSelected}
            onToggle={onToggle}
          />
          {selectedChips}
          <Button
            variant="text"
            size="small"
            sx={{ mt: 1 }}
            onClick={() => setEditing(false)}
          >
            Done
          </Button>
        </Box>
      ) : (
        selectedChips || (
          <Chip variant="outlined" sx={{ bgcolor: "white" }} label="Any" />
        )
      )}
    </DemographicRow>
  );
};

export default DemographicConceptSection;
