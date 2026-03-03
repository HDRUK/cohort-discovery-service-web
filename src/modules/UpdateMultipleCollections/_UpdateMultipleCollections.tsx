"use client";

import { Chip, Box, FormGroup, FormControlLabel } from "@mui/material";
import {
  CollectionStatus,
  CollectionWithHosts,
  FrequencyMode,
  UrlString,
} from "@/types/api";
import {
  Controller,
  FieldValues,
  FormProvider,
  useForm,
  useWatch,
} from "react-hook-form";
import { useCallback, useMemo } from "react";
import { revalidateCollections } from "@/actions/revalidate";
import { useNotify } from "@/providers/NotifyProvider";
import useCustodianStore from "@/hooks/useCustodianStore";
import SquareCheckbox from "@/components/SquareCheckbox";
import removeCollectionFromWorkgroups from "@/actions/workgroup/removeCollectionFromWorkgroups";
import addCollectionToWorkgroups from "@/actions/workgroup/addCollectionToWorkgroups";
import FormLabel from "@/components/FormLabel";
import ManageMultipleCollectionsStatus from "@/modules/ManageMultipleCollectionsStatus";
import UpdateMultipleCollectionsGuidance from "./UpdateMultipleCollectionsGuidance";
import { UpdateCollectionFormValues } from "@/types/forms";
import { useAdminDataStore } from "@/store/adminDataStore";
import UpdatePanel from "@/components/UpdatePanel";
import { useThreePane } from "@/providers/ThreePaneProvider";
//import { useSaveChanges } from "@/hooks/useSaveChanges";
import { useUserDataStore } from "@/hooks/userDataStore";

export type UpdateMultipleCollectionProps = {
  collections: CollectionWithHosts[];
};

const UpdateMultipleCollections = ({
  collections,
}: UpdateMultipleCollectionProps) => {
  const { expandedRight, toggleRight: onClose } = useThreePane();

  const currentCustodian = useCustodianStore((s) => s.current.custodian);
  const workgroups = useUserDataStore((s) => s.workgroups);

  const updateCollectionStatus = useAdminDataStore(
    (s) => s.updateCollectionStatus,
  );
  const notify = useNotify();

  const collectionsHaveMatchingWorkgroups = useMemo(() => {
    const first = (collections[0]?.workgroups?.map((wg) => wg.id) ?? [])
      .slice()
      .sort((a, b) => a - b);
    return collections.every((c) => {
      const ids = (c.workgroups?.map((wg) => wg.id) ?? [])
        .slice()
        .sort((a, b) => a - b);
      return JSON.stringify(ids) === JSON.stringify(first);
    });
  }, [collections]);

  const defaultWorkgroupNames = useMemo<string[]>(() => {
    if (!collectionsHaveMatchingWorkgroups) return [];
    return (collections[0]?.workgroups?.map((wg) => wg.name) ?? [])
      .slice()
      .sort();
  }, [collections, collectionsHaveMatchingWorkgroups]);

  const defaultValues = useMemo<UpdateCollectionFormValues>(() => {
    return {
      collection: {
        name: "",
        description: "",
        url: "" as UrlString,
        host_id: 0,
        model_state: undefined,
      },
      config: {
        frequency_mode: Number(FrequencyMode.WEEKLY),
        run_time_frequency: 0,
        run_time_hour: 0,
        run_time_minute: 0,
      },
      workgroups: defaultWorkgroupNames,
    };
  }, [defaultWorkgroupNames]);

  const formMethods = useForm<UpdateCollectionFormValues>({
    defaultValues,
    shouldUnregister: false,
  });

  const {
    control,
    handleSubmit,
    //reset,
    formState: { isDirty },
  } = formMethods;

  const selectedWorkgroupNames = useWatch({ name: "workgroups", control });

  const submitForm = useCallback(
    async (data: FieldValues, closeAfter = false) => {
      const values = data as UpdateCollectionFormValues;

      if (isDirty) {
        const selectedNames = new Set(values.workgroups ?? []);

        const nameToId = new Map(
          workgroups.map((wg) => [wg.name, wg.id] as const),
        );

        for (const c of collections) {
          const currentNames = new Set((c.workgroups ?? []).map((w) => w.name));

          const toAddNames = Array.from(selectedNames).filter(
            (name) => !currentNames.has(name),
          );
          const toAddIds = toAddNames
            .map((name) => nameToId.get(name))
            .filter((id): id is number => typeof id === "number");

          if (toAddIds.length > 0) {
            await addCollectionToWorkgroups({
              id: c.id,
              workgroup_ids: toAddIds,
            });
            notify.success(
              `Add collection ${c.id} to workgroup${toAddNames.length > 1 ? "s" : ""} ${toAddNames.join(", ")}`,
            );
          }

          const toRemoveNames = Array.from(currentNames).filter(
            (name) => !selectedNames.has(name),
          );
          const toRemoveIds = toRemoveNames
            .map((name) => nameToId.get(name))
            .filter((id): id is number => typeof id === "number");

          if (toRemoveIds.length > 0) {
            await removeCollectionFromWorkgroups({
              id: c.id,
              workgroup_ids: toRemoveIds,
            });
            notify.success(
              `Removed collection ${c.id} from workgroup${toRemoveNames.length > 1 ? "s" : ""} ${toRemoveNames.join(", ")}`,
            );
          }
        }

        const nextStateId = values.collection?.model_state?.state?.id;
        if (
          nextStateId &&
          collections[0]?.model_state?.state_id !== nextStateId
        ) {
          await updateCollectionStatus(
            collections.map((c) => c.id),
            nextStateId,
          );

          notify.success(
            `Transitioned collections (${collections.map((c) => c.name).join(", ")}) to status ${
              CollectionStatus[nextStateId as CollectionStatus]
            }`,
          );
        }

        revalidateCollections(currentCustodian?.pid ?? undefined);
      }

      if (closeAfter) onClose?.();
    },
    [
      collections,
      currentCustodian,
      isDirty,
      notify,
      onClose,
      updateCollectionStatus,
      workgroups,
    ],
  );

  const handleLockClick = useCallback(() => {
    return handleSubmit((values) => submitForm(values, true))();
  }, [handleSubmit, submitForm]);

  const handleUnlockClick = useCallback(() => {
    onClose?.();
  }, [onClose]);

  /*

  Note - struggling to get this working with onDiscard 27/02/2026
  - this needs some maintenance/re-write 
  - difficult to keep track of default values (so can be reset onDiscard)
  - too many changing states and too little time to solved this 

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
          {collectionsHaveMatchingWorkgroups ? (
            selectedWorkgroupNames.map((name) => (
              <Chip color="secondary" label={name} key={`wg-chip-${name}`} />
            ))
          ) : (
            <Box>
              <Chip label={"MIXED"} key={"wg-chip-mixed"} />
            </Box>
          )}
        </Box>
        {expandedRight && (
          <>
            <Controller
              name="workgroups"
              control={control}
              render={({ field }) => {
                const value = field.value ?? [];

                const setChecked = (name: string, checked: boolean) => {
                  const next = checked
                    ? Array.from(new Set([...value, name])).sort()
                    : value.filter((x: string) => x !== name);
                  field.onChange(next);
                };

                return (
                  <FormGroup>
                    <Box display="flex" flexDirection="column">
                      {workgroups?.map((wg) => {
                        const checked = value.includes(wg.name);
                        return (
                          <FormControlLabel
                            key={`wg-checkbox-label-${wg.id}`}
                            control={
                              <SquareCheckbox
                                checked={checked}
                                name={wg.name}
                                onChange={(e) =>
                                  setChecked(wg.name, e.target.checked)
                                }
                              />
                            }
                            label={wg.name}
                          />
                        );
                      })}
                    </Box>
                  </FormGroup>
                );
              }}
            />

            <UpdateMultipleCollectionsGuidance />
          </>
        )}
      </UpdatePanel>
    </FormProvider>
  );
};

export default UpdateMultipleCollections;
