import transitionCollection from "@/actions/transitionCollection";
import AddButton from "@/components/AddButton";
import FormRadioGroup from "@/components/FormRadioGroup";
import SquareCheckbox from "@/components/SquareCheckbox";
import SquareRadio from "@/components/SquareRadio";
import StatusChip from "@/components/StatusChip";
import { useNotify } from "@/providers/NotifyProvider";
import useCustodianStore from "@/store/useCustodianStore";
import { Collection, CollectionStatus, ModelState } from "@/types/api";
import { CollectionFilterStatus } from "@/types/collections";
import { UpdateCollectionFormValues } from "@/types/forms";
import { getCollectionStatus } from "@/utils/colours";
import { Radio } from "@mui/icons-material";
import { Box, Chip, FormControlLabel, FormGroup } from "@mui/material";
import { useState } from "react";
import { Control, Controller } from "react-hook-form";

type ManageCollectionStatusProps = {
  collection: Collection;
  expandedRight: boolean;
  control: Control<UpdateCollectionFormValues, any, UpdateCollectionFormValues>;
};

const ManageCollectionStatus = ({
  collection,
  expandedRight,
  control,
}: ManageCollectionStatusProps) => {
  const { currentCustodian } = useCustodianStore((custodianData) => ({
    currentCustodian: custodianData.currentCustodian,
    // updateCollection: custodianData.updateCollection,
  }));
  const notify = useNotify();

  const initialStatusId = collection.model_state?.state_id;
  const [selectedStatusId, setSelectedStatusId] = useState<number>(
    collection.model_state?.state_id ?? 1
  );

  const possibleOptions = {
    [CollectionStatus.DRAFT]: [] as CollectionStatus[],
    [CollectionStatus.PENDING]: currentCustodian
      ? ([] as CollectionStatus[])
      : [CollectionStatus.ACTIVE, CollectionStatus.REJECTED],
    [CollectionStatus.ACTIVE]: [CollectionStatus.DRAFT],
    [CollectionStatus.REJECTED]: [] as CollectionStatus[],
    [CollectionStatus.SUSPENDED]: [] as CollectionStatus[],
  };
  const options = (
    possibleOptions[initialStatusId as CollectionStatus] || []
  ).concat([initialStatusId as CollectionStatus]);
  console.log("options", options);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("clicked", event.target);
  };

  return (
    <>
      {collection?.model_state?.state_id == CollectionStatus.DRAFT &&
        collection?.model_state?.state && (
          <AddButton
            disabled={!expandedRight}
            label={"Request to make active"}
            action={async () => {
              await transitionCollection(collection.id, {
                state: CollectionFilterStatus.PENDING,
              });

              notify.success(
                `Requested for collection "${collection.name}" to be made active`
              );
            }}
          />
        )}
      {/* Don't show this if initial status is DRAFT */}
      {initialStatusId !== CollectionStatus.DRAFT && (
        <Box sx={{ mb: 1 }}>
          {/* Handle the case where ACTIVE -> DRAFT to labelled visually as INACTIVE */}
          {selectedStatusId === CollectionStatus.DRAFT &&
          initialStatusId === CollectionStatus.ACTIVE ? (
            <Chip
              label="INACTIVE"
              color={getCollectionStatus(CollectionStatus.DRAFT).color}
            />
          ) : (
            <StatusChip state_id={selectedStatusId} />
          )}
        </Box>
      )}

      {expandedRight && (
        <Controller
          name="workgroups"
          control={control}
          render={() => (
            <FormRadioGroup
              control={<SquareRadio />}
              label=""
              options={options
                .filter((o) => o !== selectedStatusId) // don't show currently selected status as an option
                .map((option) => {
                  return {
                    label:
                      // In the case where ACTIVE -> DRAFT, provide the visual label as INACTIVE
                      option === CollectionStatus.DRAFT &&
                      selectedStatusId === CollectionStatus.ACTIVE
                        ? "INACTIVE"
                        : CollectionStatus[option],
                    value: option,
                  };
                })}
              onChange={(e) => setSelectedStatusId(Number(e.target.value))}
            />
          )}
        />
      )}
    </>
  );
};

export default ManageCollectionStatus;
