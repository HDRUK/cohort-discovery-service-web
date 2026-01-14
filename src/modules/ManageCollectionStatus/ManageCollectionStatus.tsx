import transitionCollection from "@/actions/transitionCollection";
import AddButton from "@/components/AddButton";
import FormRadioGroup from "@/components/FormRadioGroup";
import StatusChip from "@/components/StatusChip";
import { useNotify } from "@/providers/NotifyProvider";
import useCustodianStore from "@/store/useCustodianStore";
import { Collection, CollectionStatus } from "@/types/api";
import { UpdateCollectionFormValues } from "@/types/forms";
import { getCollectionStatus } from "@/utils/colours";
import { Box, Chip } from "@mui/material";
import { useEffect, useState } from "react";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  UseFormSetValue,
} from "react-hook-form";

interface ManageCollectionStatusProps<TFieldValues extends FieldValues> {
  collection: Collection;
  expandedRight: boolean;
  control: Control<TFieldValues>;
  setValue: UseFormSetValue<UpdateCollectionFormValues>;
}

const ManageCollectionStatus = <TFieldValues extends FieldValues>({
  collection,
  expandedRight,
  control,
  setValue,
}: ManageCollectionStatusProps<TFieldValues>) => {
  const { currentCustodian } = useCustodianStore((custodianData) => ({
    currentCustodian: custodianData.currentCustodian,
  }));
  const notify = useNotify();

  const initialStatusId = collection.model_state?.state_id;
  const [selectedStatusId, setSelectedStatusId] = useState<number>(
    collection.model_state?.state_id ?? -1
  );

  const destinationOptions = {
    [CollectionStatus.DRAFT]: [] as CollectionStatus[],
    [CollectionStatus.PENDING]: currentCustodian
      ? ([] as CollectionStatus[])
      : [CollectionStatus.ACTIVE, CollectionStatus.REJECTED],
    [CollectionStatus.ACTIVE]: [CollectionStatus.DRAFT],
    [CollectionStatus.REJECTED]: [] as CollectionStatus[],
    [CollectionStatus.SUSPENDED]: [] as CollectionStatus[],
  };
  const options = (
    destinationOptions[initialStatusId as CollectionStatus] || []
  ).concat([initialStatusId as CollectionStatus]);

  useEffect(() => {
    setValue("collection.model_state.state.id", selectedStatusId, {
      shouldDirty: true,
      shouldTouch: true,
    });
  }, [selectedStatusId, setValue]);

  return (
    <>
      {collection?.model_state?.state_id == CollectionStatus.DRAFT &&
        collection?.model_state?.state && (
          <AddButton
            disabled={!expandedRight}
            label={"Request to make active"}
            action={async () => {
              await transitionCollection(collection.id, {
                state: "pending",
              });
              setSelectedStatusId(CollectionStatus.PENDING);
              notify.success(
                `Requested for collection "${collection.name}" to be made active`
              );
            }}
          />
        )}
      {/* Only show a chip if initial status is not DRAFT */}
      {initialStatusId !== CollectionStatus.DRAFT && (
        <Box sx={{ mb: 1 }}>
          {/* Handle the case where ACTIVE -> DRAFT, labelling visually as INACTIVE */}
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

      {expandedRight && initialStatusId !== CollectionStatus.DRAFT && (
        <Controller
          name={"collection.model_state.state_id" as Path<TFieldValues>}
          control={control}
          render={() => (
            <FormRadioGroup
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
              onChange={(e) => {
                setSelectedStatusId(Number(e.target.value));
              }}
            />
          )}
        />
      )}
    </>
  );
};

export default ManageCollectionStatus;
