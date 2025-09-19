"use client";

import { Tooltip } from "@mui/material";
import ShowOnClick from "@/components/ShowOnClick";
import AddIcon from "@mui/icons-material/Add";
import SearchConcepts from "./SearchConcepts";
import { ConceptSet } from "@/types/api";
import { useMemo, useState } from "react";
import { useDaphneStore } from "@/store/useDaphneStore";
import { useNotify } from "@/providers/NotifyProvider";
import { falseKeys, trueKeys } from "@/utils/numbers";

const AddNewConcept = ({ conceptSet }: { conceptSet: ConceptSet }) => {
  const notify = useNotify();
  const {
    userData: { addConceptsToSet, removeConceptsFromSet },
  } = useDaphneStore();
  const { domain, concepts } = conceptSet;

  const originalIds = useMemo(
    () => new Set(concepts?.map((c) => c.concept_id) ?? []),
    [concepts]
  );

  const [selected, setSelected] = useState<Record<number, boolean>>(
    concepts?.reduce<Record<number, boolean>>((acc, c) => {
      acc[c.concept_id] = true;
      return acc;
    }, {}) || {}
  );

  const selectedIds = useMemo(() => trueKeys(selected), [selected]);
  const idsToBeRemoved = useMemo(() => falseKeys(selected), [selected]);
  const idsToAdd = useMemo(
    () => selectedIds.filter((id) => !originalIds.has(id)),
    [selectedIds, originalIds]
  );

  const onSave = async () => {
    if (idsToBeRemoved.length > 0) {
      await removeConceptsFromSet(conceptSet.id, idsToBeRemoved);
    }
    if (idsToAdd.length > 0) {
      await addConceptsToSet(conceptSet.id, idsToAdd);
    }

    notify.success(
      `Added ${idsToAdd.length} new concepts to your set${
        idsToBeRemoved.length ? ` and removed ${idsToBeRemoved.length}` : ""
      }`
    );
  };

  return (
    <Tooltip title="Attach a new concept to your definition">
      <ShowOnClick
        dialogTitle={"Add a concept"}
        icon={<AddIcon />}
        onSave={onSave}
      >
        <SearchConcepts
          domain={domain}
          selected={selected}
          setSelected={setSelected}
        />
      </ShowOnClick>
    </Tooltip>
  );
};

export default AddNewConcept;
