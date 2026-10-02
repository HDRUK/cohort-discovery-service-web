import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { useForm, useWatch } from "react-hook-form";
import { Concept } from "@/types/api";
import { useSaveChanges } from "@/hooks/useSaveChanges";

type RuleConceptSelectionFormValues = { concepts: Record<number, Concept> };

export interface UseRuleConceptSelectionResult {
  selectedConcepts: Concept[];
  selectedIds: Record<number, boolean>;
  setSelectedIds: Dispatch<SetStateAction<Record<number, boolean>>>;
  hasOptions: boolean;
  setHasOptions: Dispatch<SetStateAction<boolean>>;
  handleOnToggle: (concept: Concept, toggled: boolean) => void;
  handleConfirm: () => void;
  clearAll: () => void;
}

const useRuleConceptSelection = (
  onConfirm: (concept: Concept | Concept[]) => void,
): UseRuleConceptSelectionResult => {
  const [hasOptions, setHasOptions] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Record<number, boolean>>({});

  const { control, setValue, reset } = useForm<RuleConceptSelectionFormValues>({
    defaultValues: { concepts: {} },
  });

  const conceptsMap = useWatch({ control, name: "concepts", defaultValue: {} });

  const selectedConcepts = useMemo(
    () => Object.values(conceptsMap),
    [conceptsMap],
  );

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

  useSaveChanges({
    control,
    entityName: "rule selection",
    onSave: handleConfirm,
    onDiscard: clearAll,
    saveText: "Confirm selection",
    discardText: "Discard",
    showChanges: false,
  });

  return {
    selectedConcepts,
    selectedIds,
    setSelectedIds,
    hasOptions,
    setHasOptions,
    handleOnToggle,
    handleConfirm,
    clearAll,
  };
};

export default useRuleConceptSelection;
