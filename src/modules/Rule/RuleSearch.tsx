"use client";

import { Concept } from "@/types/api";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import SearchConcepts from "@/components/SearchConcepts";
import SelectedConceptsPanel from "@/components/SelectedConceptsPanel";
import { useSaveChanges } from "@/hooks/useSaveChanges";

type FormValues = { concepts: Record<number, Concept> };

interface RuleSearchProps {
  onConfirm: (concept: Concept | Concept[]) => void;
  isSelected?: boolean;
  onSelect?: () => void;
}

const RuleSearch = ({ onConfirm, isSelected, onSelect }: RuleSearchProps) => {
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [hasOptions, setHasOptions] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Record<number, boolean>>({});

  const { control, setValue, reset } = useForm<FormValues>({
    defaultValues: { concepts: {} },
  });

  const conceptsMap = useWatch({ control, name: "concepts", defaultValue: {} });
  const selectedConcepts = useMemo(() => Object.values(conceptsMap), [conceptsMap]);

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

  const clearAll = useCallback(() => {
    setSelectedIds({});
    reset({ concepts: {} });
  }, [reset]);

  const handleRemove = useCallback(
    (concept: Concept) => {
      setSelectedIds((prev) => {
        const next = { ...prev };
        delete next[concept.concept_id];
        return next;
      });
      const next = { ...conceptsMap };
      delete next[concept.concept_id];
      if (Object.keys(next).length === 0) {
        reset({ concepts: {} });
      } else {
        setValue("concepts", next, { shouldDirty: true });
      }
    },
    [conceptsMap, setValue, reset],
  );

  const handleConfirm = useCallback(() => {
    const clean = selectedConcepts.map(
      ({ alternatives: _omit, ...c }) => c as Concept,
    );
    if (clean.length === 1) {
      onConfirm(clean[0]);
    } else if (clean.length > 1) {
      onConfirm(clean);
    }
    reset({ concepts: {} });
    setSelectedIds({});
  }, [selectedConcepts, onConfirm, reset]);

  const handleSingleSelect = useCallback(
    (concept: Concept) => {
      const { alternatives: _omit, ...clean } = concept as Concept & {
        alternatives?: Concept[];
      };
      onConfirm(clean as Concept);
    },
    [onConfirm],
  );

  useSaveChanges({
    control,
    entityName: "rule selection",
    onSave: handleConfirm,
    onDiscard: () => {
      clearAll();
      setIsMultiSelect(false);
    },
    saveText: "Confirm selection",
    discardText: "Discard",
    showChanges: false,
  });

  useEffect(() => {
    if (!isSelected) {
      /*
       * Intentional exception to react-hooks/set-state-in-effect:
       * isSelected is external prop state — when the rule card loses selection,
       * pending multi-select choices and the search mode must reset silently.
       */
      // eslint-disable-next-line react-hooks/set-state-in-effect
      clearAll();
      setIsMultiSelect(false);
    }
  }, [isSelected, clearAll]);

  const switchToMulti = useCallback(() => setIsMultiSelect(true), []);
  const switchToSingle = useCallback(() => {
    setIsMultiSelect(false);
    clearAll();
  }, [clearAll]);

  const toggleRow = hasOptions ? (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      py={0.75}
    >
      <Typography variant="body2" color="text.secondary">
        {isMultiSelect
          ? "Want to select only one at a time?"
          : "Want to select more at once?"}
      </Typography>
      <Button
        variant="text"
        size="small"
        color="secondary"
        onClick={isMultiSelect ? switchToSingle : switchToMulti}
      >
        {isMultiSelect ? "Enable Single-select" : "Enable Multi-select"}
      </Button>
    </Stack>
  ) : null;

  return (
    <Box onClick={(e) => { e.stopPropagation(); onSelect?.(); }}>
      <SearchConcepts
        multiple={isMultiSelect}
        hideSelectAll
        selected={isMultiSelect ? selectedIds : undefined}
        setSelected={isMultiSelect ? setSelectedIds : undefined}
        onToggle={isMultiSelect ? handleOnToggle : undefined}
        onClick={!isMultiSelect ? handleSingleSelect : undefined}
        onHasOptions={setHasOptions}
        headerSlot={toggleRow}
      />
      {isMultiSelect && hasOptions && (
        <>
          <Divider sx={{ mt: 1 }} />
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
