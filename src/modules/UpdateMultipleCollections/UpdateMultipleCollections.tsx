"use client";
import {
  Typography,
  IconButton,
  Chip,
  Box,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import LockOutlineIcon from "@mui/icons-material/LockOutline";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import {
  CollectionHost,
  CollectionStatus,
  CollectionWithHosts,
  Workgroup,
} from "@/types/api";
import {
  Controller,
  FieldValues,
  FormProvider,
  useForm,
} from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import { revalidateAction } from "@/actions/revalidate";
import { useNotify } from "@/providers/NotifyProvider";
import useCustodianStore from "@/store/useCustodianStore";
import { useLogDependencyChanges } from "@/utils/deps";
import {
  getTagCustodianCollection,
  TAG_COLLECTION_ADMIN,
  TAG_CUSTODIAN_COLLECTION,
} from "@/config/tags";
import SquareCheckbox from "@/components/SquareCheckbox";
import removeCollectionFromWorkgroups from "@/actions/removeCollectionFromWorkgroups";
import addCollectionToWorkgroups from "@/actions/addCollectionToWorkgroups";
import FormLabel from "@/components/FormLabel";
import ManageMultipleCollectionsStatus from "@/modules/ManageMultipleCollectionsStatus";
import UpdateMultipleCollectionsGuidance from "./UpdateMultipleCollectionsGuidance";
import transitionCollections from "@/actions/transitionCollections";
import { UpdateCollectionFormValues } from "@/types/forms";

export type UpdateMultipleCollectionProps = {
  collections: CollectionWithHosts[];
  collectionHosts: CollectionHost[];
  workgroups: Workgroup[];
  expandedRight: boolean;
  expandedLeft: boolean;
  onClose?: () => void;
};

const UpdateMultipleCollections = ({
  collections,
  collectionHosts,
  workgroups,
  expandedRight,
  onClose,
}: UpdateMultipleCollectionProps) => {
  const { currentCustodian } = useCustodianStore((custodianData) => ({
    currentCustodian: custodianData.currentCustodian,
  }));

  const notify = useNotify();

  const formMethods = useForm<UpdateCollectionFormValues>();

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
              .length > 0
          );
        });
      }
      return map;
    }
  );

  const submitForm = useCallback(
    async (data: FieldValues, closeAfter = false) => {
      if (isDirty) {
        // for each collection, compare to what's selected, and run the add/removes required
        for (const c of collections) {
          const cwNames = new Set((c.workgroups ?? []).map((w) => w.name));
          const newWorkgroups = workgroups.filter(
            (wg) => workgroupValues.get(wg.name) && !cwNames.has(wg.name)
          );

          if (newWorkgroups.length > 0) {
            await addCollectionToWorkgroups({
              id: c.id,
              workgroup_ids: newWorkgroups.map((wg) => wg.id),
            });
            notify.success(
              `Add collection ${c.id} to workgroup${
                newWorkgroups.length > 1 ? "s" : ""
              } ${newWorkgroups.map((wg) => wg.name).join(", ")}`
            );
          }

          const workgroupsToRemove = workgroups.filter(
            (wg) => !workgroupValues.get(wg.name) && cwNames.has(wg.name)
          );

          if (workgroupsToRemove.length > 0) {
            await removeCollectionFromWorkgroups({
              id: c.id,
              workgroup_ids: workgroupsToRemove.map((wg) => wg.id),
            });
            notify.success(
              `Removed collection ${c.id} from workgroup${
                workgroupsToRemove.length > 1 ? "s" : ""
              } ${workgroupsToRemove.map((wg) => wg.name).join(", ")}`
            );
          }
        }

        if (
          data.collection.model_state?.state.id &&
          collections[0].model_state?.state_id !==
            data.collection.model_state?.state.id
        ) {
          await transitionCollections(
            collections.map((c) => c.id),
            {
              state:
                CollectionStatus[
                  data.collection.model_state.state.id
                ].toLowerCase(),
            }
          );
          notify.success(
            `Transitioned collections (${collections
              .map((c) => c.name)
              .join(", ")}) to status ${
              CollectionStatus[
                data.collection.model_state.state.id as CollectionStatus
              ]
            }`
          );
        }

        revalidateAction(TAG_CUSTODIAN_COLLECTION);
        revalidateAction(TAG_COLLECTION_ADMIN);
        if (currentCustodian) {
          revalidateAction(getTagCustodianCollection(currentCustodian.pid));
        }
      }

      if (closeAfter) {
        onClose?.();
      }
    },
    [
      collections,
      currentCustodian,
      isDirty,
      notify,
      onClose,
      workgroups,
      workgroupValues,
    ]
  );

  const handleEnter = useCallback(
    () => handleSubmit((values) => submitForm(values, false))(),
    [handleSubmit, submitForm]
  );

  const handleLockClick = useCallback(
    () => handleSubmit((values) => submitForm(values, true))(),
    [handleSubmit, submitForm]
  );

  const handleUnlockClick = useCallback(() => {
    onClose?.();
  }, [onClose]);

  useLogDependencyChanges("UpdateMultipleCollections", {
    collections,
    collectionHosts,
    ...formMethods,
    currentCustodian,
    handleEnter,
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

  return (
    <FormProvider {...formMethods}>
      <Typography
        component="div"
        variant="overline"
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        Bulk Collection Actions
        <IconButton
          size="small"
          sx={{ ml: "auto" }}
          onClick={() => {
            if (expandedRight) {
              handleLockClick();
            } else {
              handleUnlockClick();
            }
          }}
        >
          {expandedRight ? <LockOpenIcon /> : <LockOutlineIcon />}
        </IconButton>
      </Typography>

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
          collections[0].workgroups?.map((w) => (
            <Chip color="secondary" label={w.name} key={`wg-chip-${w.name}`} />
          ))}
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
    </FormProvider>
  );
};

export default UpdateMultipleCollections;
