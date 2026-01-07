"use client";
import {
  Typography,
  IconButton,
  Chip,
  Box,
  Checkbox,
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
import { Controller, FormProvider, useForm } from "react-hook-form";
import AddButton from "@/components/AddButton";
import { useCallback, useEffect, useState } from "react";
import { revalidateAction } from "@/actions/revalidate";
import { useNotify } from "@/providers/NotifyProvider";
import useCustodianStore from "@/store/useCustodianStore";
import { useLogDependencyChanges } from "@/utils/deps";
import {
  getTagCustodianCollection,
  TAG_CUSTODIAN_COLLECTION,
} from "@/config/tags";
import StatusChip from "@/components/StatusChip";
import transitionCollections from "@/actions/transitionCollections";
import { CollectionFilterStatus } from "@/types/collections";
import useAdminStore from "@/store/useAdminStore";
import removeCollectionFromWorkgroups from "@/actions/removeCollectionFromWorkgroups";
import addCollectionToWorkgroups from "@/actions/addCollectionToWorkgroups";
import FormLabel from "@/components/FormLabel";
import UpdateMultipleCollectionsGuidance from "./UpdateMultipleCollectionsGuidance";

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
  const { currentCustodian, updateCollection } = useCustodianStore(
    (custodianData) => ({
      currentCustodian: custodianData.currentCustodian,
      updateCollection: custodianData.updateCollection,
    })
  );

  const { updateCollection: updateCollectionAdmin } = useAdminStore(
    (adminData) => ({
      updateCollection: adminData.updateCollection,
    })
  );

  const notify = useNotify();

  const [workgroupValues, setWorkgroupValues] = useState<Map<string, boolean>>(
    () => {
      const map = new Map<string, boolean>();
      workgroups.forEach((wg) => {
        map.set(
          wg.name,
          (collections[0].workgroups?.filter((cw) => cw.id === wg.id) || [])
            .length > 0
        );
      });
      return map;
    }
  );

  const [uniqueStates, setUniqueStates] = useState<(number | undefined)[]>([]);
  const [
    collectionsHaveMatchingWorkgroups,
    setCollectionsHaveMatchingWorkgroups,
  ] = useState<boolean>(false);

  const formMethods = useForm();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = formMethods;

  useEffect(() => {
    if (!collections) return;

    setUniqueStates([
      ...new Set(collections.map((c) => c?.model_state?.state_id)),
    ]);

    // Check that all collections have the same workgroups
    const firstWorkgroups = (
      collections[0].workgroups?.map((wg) => wg.id) || []
    ).sort();

    setCollectionsHaveMatchingWorkgroups(
      collections.every((c) => {
        let thisWorkgroups = (c.workgroups?.map((wg) => wg.id) || []).sort();
        if (JSON.stringify(thisWorkgroups) != JSON.stringify(firstWorkgroups)) {
          return false;
        }
        return true;
      })
    );
  }, [collections, reset]);

  const submitForm = useCallback(
    async (closeAfter = false) => {
      if (isDirty) {
        if (collectionsHaveMatchingWorkgroups) {
          // for each collection, compare to what's selected, and run the add/removes required
          collections.forEach(async (c) => {
            const newWorkgroups = workgroups
              .filter((wg) => workgroupValues.get(wg.name))
              .filter(
                (wg) =>
                  (
                    collections[0].workgroups?.filter(
                      (cw) => cw.name === wg.name
                    ) || []
                  ).length === 0
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

            const workgroupsToRemove = workgroups
              .filter((wg) => !workgroupValues.get(wg.name))
              .filter(
                (wg) =>
                  (
                    collections[0].workgroups?.filter(
                      (cw) => cw.name === wg.name
                    ) || []
                  ).length > 0
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
          });
        }

        revalidateAction(TAG_CUSTODIAN_COLLECTION);
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
      updateCollection,
      updateCollectionAdmin,
      onClose,
      workgroups,
      workgroupValues,
    ]
  );

  const handleEnter = useCallback(
    () => handleSubmit(() => submitForm(false))(),
    [handleSubmit, submitForm]
  );

  const handleLockClick = useCallback(
    () => handleSubmit(() => submitForm(true))(),
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
    updateCollection,
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

  useEffect(() => {
    const selectedWorkgroups = Array.from(workgroupValues.entries())
      .filter(([_, checked]) => checked)
      .map(([name]) => name);
    formMethods.setValue("workgroups", selectedWorkgroups, {
      shouldDirty: true,
      shouldTouch: true,
    });
  }, [workgroupValues, collections, formMethods]);

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
      {uniqueStates.length > 1 && (
        <Box>
          <StatusChip state_id={-1} sx={{ my: 1 }} />
        </Box>
      )}
      {uniqueStates.length === 1 &&
        uniqueStates[0] !== CollectionStatus.DRAFT && (
          <Box>
            <StatusChip state_id={uniqueStates[0]} sx={{ my: 1 }} />
          </Box>
        )}
      {uniqueStates.length === 1 &&
        uniqueStates[0] === CollectionStatus.DRAFT && (
          <AddButton
            label={"Request to make active"}
            disabled={!expandedRight}
            action={() => {
              transitionCollections(
                collections.map((c) => c.id),
                {
                  state: CollectionFilterStatus.PENDING,
                }
              );

              notify.success(
                `Requested for collections "${collections
                  .map((c) => c.name)
                  .join(", ")}" to be made active`
              );
            }}
          />
        )}
      {/* Handle the logic of when to display checkboxes for certain states - this needs the logic explained before implementation
        {!currentCustodian &&
          (collection?.model_state?.state_id == CollectionStatus.DRAFT ||
            collection?.model_state?.state_id == CollectionStatus.ACTIVE ||
            collection?.model_state?.state_id == CollectionStatus.REJECTED)} */}
      <FormLabel underlined>Workgroup access</FormLabel>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          alignItems: "center",
          mb: 2,
        }}
      >
        {collectionsHaveMatchingWorkgroups && (
          <>
            {collections[0].workgroups?.map((w) => (
              <Chip
                color="secondary"
                label={w.name}
                key={`wg-chip-${w.name}`}
              />
            ))}
          </>
        )}
        {!collectionsHaveMatchingWorkgroups && (
          <Box>{<Chip label={"MIXED"} key={"wg-chip-mixed"} />}</Box>
        )}
      </Box>

      {expandedRight && collectionsHaveMatchingWorkgroups && (
        <>
          <Controller
            name="workgroups"
            disabled={!expandedRight}
            control={control}
            render={() => {
              return (
                <FormGroup>
                  <Box display="flex" flexDirection="column">
                    {workgroups?.map((w) => (
                      <FormControlLabel
                        disabled={!expandedRight}
                        control={
                          <Checkbox
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
              );
            }}
          />
          <UpdateMultipleCollectionsGuidance />
        </>
      )}
    </FormProvider>
  );
};

export default UpdateMultipleCollections;
