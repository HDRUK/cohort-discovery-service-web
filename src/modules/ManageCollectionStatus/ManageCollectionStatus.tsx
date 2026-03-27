import AddButton from "@/components/AddButton";
import FormRadioGroup from "@/components/FormRadioGroup";
import StatusChip from "@/components/StatusChip";
import { useNotify } from "@/providers/NotifyProvider";
import useCustodianStore from "@/hooks/useCustodianStore";
import { Collection, CollectionStatus } from "@/types/api";
import { getCollectionStatus } from "@/utils/colours";
import { Box, Chip } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useConfirm } from "@/hooks/useConfirm";
import { UpdateCollectionFormValues } from "@/types/forms";

interface ManageCollectionStatusProps {
  collection: Collection;
  expandedRight: boolean;
}

const ManageCollectionStatus = ({
  collection,
  expandedRight,
}: ManageCollectionStatusProps) => {
  const { control, setValue } = useFormContext<UpdateCollectionFormValues>();

  const { currentCustodian } = useCustodianStore((custodianData) => ({
    currentCustodian: custodianData.current.custodian,
  }));
  const requestCollectionMadeActive = useCustodianStore(
    (s) => s.requestCollectionMadeActive,
  );
  const notify = useNotify();

  const initialStatusId = collection.model_state?.state_id;
  const [selectedStatusId, setSelectedStatusId] = useState<number>(
    collection.model_state?.state_id ?? -1,
  );

  const pendingDestinations: CollectionStatus[] = currentCustodian
    ? []
    : [CollectionStatus.ACTIVE, CollectionStatus.REJECTED];

  const destinationOptions: Record<CollectionStatus, CollectionStatus[]> = {
    [CollectionStatus.DRAFT]: [],
    [CollectionStatus.PENDING]: pendingDestinations,
    [CollectionStatus.ACTIVE]: [CollectionStatus.DRAFT],
    [CollectionStatus.REJECTED]: [CollectionStatus.DRAFT],
    [CollectionStatus.SUSPENDED]: [],
  };

  const options = (
    destinationOptions[initialStatusId as CollectionStatus] || []
  ).concat([initialStatusId as CollectionStatus]);

  useEffect(() => {
    setValue("collection.model_state.state.id", selectedStatusId, {
      shouldDirty: selectedStatusId !== initialStatusId,
      shouldTouch: selectedStatusId !== initialStatusId,
    });
  }, [initialStatusId, selectedStatusId, setValue]);

  const confirm = useConfirm();

  const handleAction = async () => {
    await requestCollectionMadeActive(collection.id);
    setSelectedStatusId(CollectionStatus.PENDING);
    notify.success(
      `Requested for collection "${collection.name}" to be made active`,
    );
  };

  return (
    <>
      {collection?.model_state?.state_id == CollectionStatus.DRAFT &&
        collection?.model_state?.state && (
          <AddButton
            disabled={!expandedRight}
            label={"Request to make active"}
            onClick={handleAction}
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
          name={"collection.model_state.state_id"}
          control={control}
          render={({ field }) => (
            <FormRadioGroup
              label=""
              value={field.value}
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
              onChange={async (e) => {
                const next = Number(e.target.value);

                if (next === selectedStatusId) return;

                const option = getCollectionStatus(next);
                const label = option.label ?? CollectionStatus[next];

                const ok = await confirm({
                  props: {
                    action: `change the collection status of '${collection.name}' to '${label}'`,
                  },
                  confirmText: "Yes",
                  confirmColor: "success",
                });
                if (!ok || ok === "cancel") {
                  return;
                }
                field.onChange(next);
                setSelectedStatusId(next);
              }}
            />
          )}
        />
      )}
    </>
  );
};

export default ManageCollectionStatus;
