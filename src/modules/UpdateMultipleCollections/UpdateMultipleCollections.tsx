"use client";
import { Chip, Box, FormGroup, FormControlLabel } from "@mui/material";
import { CollectionStatus, CollectionWithHosts } from "@/types/api";
import {
  Controller,
  FieldValues,
  FormProvider,
  useForm,
} from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import { useNotify } from "@/providers/NotifyProvider";
import { useLogDependencyChanges } from "@/utils/deps";
import SquareCheckbox from "@/components/SquareCheckbox";
import updateCollections from "@/actions/collection/updateCollections";
import { describeCollectionSave } from "@/utils/collectionSave";
import FormLabel from "@/components/FormLabel";
import ManageMultipleCollectionsStatus from "@/modules/ManageMultipleCollectionsStatus";
import UpdateMultipleCollectionsGuidance from "./UpdateMultipleCollectionsGuidance";
import { UpdateCollectionFormValues } from "@/types/forms";
import UpdatePanel from "@/components/UpdatePanel";
import { useThreePane } from "@/providers/ThreePaneProvider";
import { useSessionData } from "@/contexts/SessionDataContext";
import { useCustodianSection } from "@/contexts/CustodianSectionContext";

export type UpdateMultipleCollectionProps = {
  collections: CollectionWithHosts[];
};

const getDefaultValues = (collection: CollectionWithHosts | null) => {
  if (!collection) {
    return {
      collection: {
        model_state: undefined,
        workgroups: [],
      },
    };
  }

  const { model_state, workgroups } = collection;
  return {
    collection: {
      model_state: model_state,
      workgroups: workgroups,
    },
    workgroups: workgroups?.map((wg) => wg.name).sort(),
  };
};

const UpdateMultipleCollections = ({
  collections,
}: UpdateMultipleCollectionProps) => {
  const { expandedRight, toggleRight: onClose } = useThreePane();
  const currentCustodian = useCustodianSection();

  const workgroups = useSessionData().workgroups;

  const notify = useNotify();

  const formMethods = useForm<UpdateCollectionFormValues>({
    defaultValues: getDefaultValues(collections[0]),
  });

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = formMethods;

  // Check that all collections have the same workgroups
  const firstWorkgroups = (
    collections[0].workgroups?.map((wg) => wg.id) || []
  ).sort();

  const collectionsHaveMatchingWorkgroups = collections.every((c) => {
    const thisWorkgroups = (c.workgroups?.map((wg) => wg.id) || []).sort();
    if (JSON.stringify(thisWorkgroups) != JSON.stringify(firstWorkgroups)) {
      return false;
    }
    return true;
  });

  const [workgroupValues, setWorkgroupValues] = useState<Map<string, boolean>>(
    () => {
      const map = new Map<string, boolean>();

      if (collectionsHaveMatchingWorkgroups) {
        workgroups.forEach((wg) => {
          map.set(
            wg.name,
            (collections[0].workgroups?.filter((cw) => cw.id === wg.id) || [])
              .length > 0,
          );
        });
      }
      return map;
    },
  );

  const submitForm = useCallback(
    async (data: FieldValues, closeAfter = false) => {
      if (isDirty) {
        const changes = collections.map((c) => {
          const cwNames = new Set((c.workgroups ?? []).map((w) => w.name));
          return {
            id: c.id,
            name: c.name,
            addWorkgroupIds: workgroups
              .filter(
                (wg) => workgroupValues.get(wg.name) && !cwNames.has(wg.name),
              )
              .map((wg) => wg.id),
            removeWorkgroupIds: workgroups
              .filter(
                (wg) => !workgroupValues.get(wg.name) && cwNames.has(wg.name),
              )
              .map((wg) => wg.id),
          };
        });

        const nextStateId = data.collection.model_state?.state.id;
        const status =
          nextStateId && collections[0].model_state?.state_id !== nextStateId
            ? (nextStateId as CollectionStatus)
            : undefined;

        const result = await updateCollections(changes, status);

        const { ok, message } = describeCollectionSave(
          `${collections.length} collection${collections.length === 1 ? "" : "s"}`,
          result,
          status !== undefined ? CollectionStatus[status] : undefined,
        );
        if (!ok) {
          notify.error(message);
          return;
        }
        notify.success(message);
      }

      if (closeAfter) {
        onClose?.();
      }
    },
    [collections, isDirty, notify, onClose, workgroups, workgroupValues],
  );

  const handleLockClick = useCallback(
    () => handleSubmit((values) => submitForm(values, true))(),
    [handleSubmit, submitForm],
  );

  const handleUnlockClick = useCallback(() => {
    onClose?.();
  }, [onClose]);

  useLogDependencyChanges("UpdateMultipleCollections", {
    collections,
    ...formMethods,
    currentCustodian,
    handleLockClick,
    handleUnlockClick,
    submitForm,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWorkgroupValues((prev) => {
      const updated = new Map(prev);
      updated.set(event.target.name, event.target.checked);
      return updated;
    });
  };

  const { setValue } = formMethods;

  useEffect(() => {
    const selectedWorkgroups = Array.from(workgroupValues.entries())
      .filter(([_, checked]) => checked)
      .map(([name]) => name);
    setValue("workgroups", selectedWorkgroups, {
      shouldDirty: true,
      shouldTouch: true,
    });
  }, [workgroupValues, setValue]);

  /*

  Note - struggling to get this working with onDiscard 27/02/2026
  - this needs some maintenance/re-write on Multiple functionality
  - difficult to keep track of default values (so can be reset onDiscard)
  - too many changing states and useEffects 

  const onSave = () => {
    handleSubmit((values) => submitForm(values, false))();
  };

  const onDiscard = useCallback(() => {
    reset(defaultValues);
    onClose?.();
  }, [reset, defaultValues, onClose]);

  useSaveChanges<UpdateCollectionFormValues>({
    control,
    entityName: collections.map((c) => c.name).join(" , "),
    onSave,
    onDiscard,
  });
  */

  return (
    <FormProvider {...formMethods}>
      <UpdatePanel
        label="Bulk Collection Actions"
        expandedRight={expandedRight}
        onLockClick={handleLockClick}
        onUnlockClick={handleUnlockClick}
      >
        <FormLabel underlined>Collection Status</FormLabel>
        <ManageMultipleCollectionsStatus
          collections={collections}
          expandedRight={expandedRight}
          key={`manage-multiple-colls-status-${collections
            .map((c) => c.id)
            .sort()
            .join("-")}`}
        />
        <FormLabel underlined>Workgroup access</FormLabel>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            alignItems: "center",
          }}
        >
          {collectionsHaveMatchingWorkgroups &&
            Array.from(workgroupValues.entries()).map(
              ([name, checked]) =>
                checked && (
                  <Chip
                    color="secondary"
                    label={name}
                    key={`wg-chip-${name}`}
                  />
                ),
            )}
          {!collectionsHaveMatchingWorkgroups && !!collections && (
            <Box>{<Chip label={"MIXED"} key={"wg-chip-mixed"} />}</Box>
          )}
        </Box>
        {expandedRight && (
          <>
            <Controller
              name="workgroups"
              disabled={!expandedRight}
              control={control}
              render={() => (
                <FormGroup>
                  <Box display="flex" flexDirection="column">
                    {workgroups?.map((w) => (
                      <FormControlLabel
                        control={
                          <SquareCheckbox
                            checked={Boolean(workgroupValues.get(w.name))}
                            key={`wg-checkbox-${w.name}`}
                            name={w.name}
                            onChange={handleChange}
                          />
                        }
                        label={w.name}
                        key={`wg-checkbox-label-${w.name}`}
                      />
                    ))}
                  </Box>
                </FormGroup>
              )}
            />
            <UpdateMultipleCollectionsGuidance />
          </>
        )}
      </UpdatePanel>
    </FormProvider>
  );
};

export default UpdateMultipleCollections;
