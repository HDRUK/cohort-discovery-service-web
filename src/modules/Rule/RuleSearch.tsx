"use client";

import { Concept } from "@/types/api";
import { Box } from "@mui/material";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { Control, UseFormReset, UseFormSetValue } from "react-hook-form";
import SearchConcepts from "@/components/SearchConcepts";

type FormValues = { concepts: Record<number, Concept> };

interface RuleSearchProps {
  onConfirm: (concept: Concept | Concept[]) => void;
  onSelect?: () => void;
  conceptsMap: Record<number, Concept>;
  control: Control<FormValues, unknown, FormValues>;
  setValue: UseFormSetValue<FormValues>;
  reset: UseFormReset<FormValues>;
  selectedIds: Record<number, boolean>;
  setSelectedIds: Dispatch<SetStateAction<Record<number, boolean>>>;
  setHasOptions: Dispatch<SetStateAction<boolean>>;
}

const RuleSearch = ({
  onConfirm,
  onSelect,
  conceptsMap,
  setValue,
  reset,
  selectedIds,
  setSelectedIds,
  setHasOptions,
}: RuleSearchProps) => {
  // temporarily disabled unused vars warning for setIsMultiSelect
  // until we figure out if we're gonna go for multi-select only
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isMultiSelect, setIsMultiSelect] = useState(true);

  const handleOnToggle = useCallback(
    (concept: Concept, toggled: boolean) => {
      const next = { ...conceptsMap };
      if (toggled) {
        next[concept.concept_id] = concept;
      } else {
        delete next[concept.concept_id];
      }
      if (Object.keys(next).length === 0) {
        reset({ concepts: {} });
      } else {
        setValue("concepts", next, { shouldDirty: true });
      }
    },
    [conceptsMap, setValue, reset],
  );

  const handleSingleSelect = useCallback(
    (concept: Concept) => {
      const { alternatives: _omit, ...clean } = concept as Concept & {
        alternatives?: Concept[];
      };
      onConfirm(clean as Concept);
    },
    [onConfirm],
  );

  // Commenting out the single/multi-select toggle related behavior
  // until we figure out whether multi-select-only works well
  //
  // const switchToMulti = useCallback(() => setIsMultiSelect(true), []);
  // const switchToSingle = useCallback(() => {
  //   setIsMultiSelect(false);
  //   clearAll();
  // }, [clearAll]);

  // const toggleRow = hasOptions ? (
  //   <Stack
  //     direction="row"
  //     justifyContent="flex-start"
  //     alignItems="center"
  //     py={0.75}
  //   >
  //     <Typography variant="body2" color="text.secondary">
  //       {isMultiSelect
  //         ? "Want to select only one at a time?"
  //         : "Want to select more at once?"}
  //     </Typography>
  //     <Button
  //       variant="text"
  //       size="small"
  //       color="secondary"
  //       onClick={isMultiSelect ? switchToSingle : switchToMulti}
  //     >
  //       {isMultiSelect ? "Enable Single-select" : "Enable Multi-select"}
  //     </Button>
  //   </Stack>
  // ) : null;

  return (
    <Box
      data-testid="rule-search-container"
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
    >
      <SearchConcepts
        multiple={isMultiSelect}
        hideSelectAll
        selected={isMultiSelect ? selectedIds : undefined}
        setSelected={isMultiSelect ? setSelectedIds : undefined}
        onToggle={isMultiSelect ? handleOnToggle : undefined}
        onClick={!isMultiSelect ? handleSingleSelect : undefined}
        onHasOptions={setHasOptions}
        // Commented out option to toggle between single/multi-select modes.
        // If we find that multi-select works fine, then need to delete this,
        // and other related single-select code in the future.
        // headerSlot={toggleRow}
      />
    </Box>
  );
};

export default RuleSearch;
