"use client";

import { Box } from "@mui/material";
import SearchConcepts from "@/components/SearchConcepts";
import { UseRuleConceptSelectionResult } from "./useRuleConceptSelection";

interface RuleSearchProps {
  onSelect?: () => void;
  selection: UseRuleConceptSelectionResult;
}

const RuleSearch = ({ onSelect, selection }: RuleSearchProps) => {
  const { selectedIds, setSelectedIds, handleOnToggle, setHasOptions } =
    selection;

  return (
    <Box
      data-testid="rule-search-container"
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
    >
      <SearchConcepts
        multiple
        hideSelectAll
        selected={selectedIds}
        setSelected={setSelectedIds}
        onToggle={handleOnToggle}
        onHasOptions={setHasOptions}
      />
    </Box>
  );
};

export default RuleSearch;
