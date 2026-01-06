"use client";
import {
  Typography,
  IconButton,
  Chip,
  Box,
  MenuItem,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import LockOutlineIcon from "@mui/icons-material/LockOutline";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ActionMenuSection from "@/components/ActionMenuSection";
import {
  CollectionHost,
  CollectionStatus,
  CollectionWithHosts,
  FrequencyMode,
  UrlString,
  Workgroup,
} from "@/types/api";
import { Controller, FormProvider, useForm } from "react-hook-form";
import AddButton from "@/components/AddButton";
import FormTextField from "@/components/FormTextField";
import CollectionConfig from "@/components/CollectionConfig";
import {
  UpdateCollectionFormValues,
  UpdateMultipleCollectionsFormValues,
} from "@/types/forms";
import { useCallback, useEffect, useState } from "react";
import { revalidateAction } from "@/actions/revalidate";
import { useNotify } from "@/providers/NotifyProvider";
import FormDropdown from "@/components/FormDropdown";
import DistributionStatus from "../DistrubutionStatus";
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

export type UpdateMultipleCollectionProps = {
  collections: CollectionWithHosts[];
  collectionHosts: CollectionHost[];
  workgroups: Workgroup[];
  expandedRight: boolean;
  expandedLeft: boolean;
  onClose?: () => void;
};

// const getDefaultValues = (collections: CollectionWithHosts[]) => {
//   if (!collections) {
//     return {
//       collection: {
//         name: "",
//         description: "",
//         url: "" as UrlString,
//         host_id: 0,
//         model_state: undefined,
//         workgroups: [],
//       },
//       config: {
//         frequency_mode: Number(FrequencyMode.WEEKLY),
//         run_time_frequency: 0,
//         run_time_hour: 0,
//         run_time_minute: 0,
//       },
//     };
//   }

//   const {
//     name,
//     description,
//     url,
//     host: hosts,
//     config,
//     model_state,
//     workgroups,
//   } = collection;
//   const [host] = hosts;
//   return {
//     collection: {
//       name,
//       description: description || "",
//       url: url || ("" as UrlString),
//       host_id: host.id,
//       model_state: model_state,
//       workgroups: workgroups,
//     },
//     config: {
//       frequency_mode: config.frequency_mode,
//       run_time_frequency: config.run_time_frequency,
//       run_time_hour: config.run_time_hour ?? 0,
//       run_time_minute: config.run_time_minute ?? 0,
//     },
//   };
// };

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

  // const [workgroupValues, setWorkgroupValues] = useState<Map<string, boolean>>(
  //   () => {
  //     const map = new Map<string, boolean>();
  //     workgroups.forEach((wg) => {
  //       map.set(
  //         wg.name,
  //         (collection.workgroups?.filter((cw) => cw.id === wg.id) || [])
  //           .length > 0
  //       );
  //     });
  //     return map;
  //   }
  // );

  const [uniqueStates, setUniqueStates] = useState<(number | undefined)[]>([]);

  const formMethods = useForm<UpdateMultipleCollectionsFormValues>({
    // defaultValues: getDefaultValues(collection),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = formMethods;

  useEffect(() => {
    if (!collections) return;
    console.log(collections.length);
    // const newValues = getDefaultValues(collections);
    setUniqueStates([
      ...new Set(collections.map((c) => c?.model_state?.state_id)),
    ]);
    console.log("uniqueStates", uniqueStates);
    // reset(newValues, {
    //   keepDirty: false,
    //   keepTouched: false,
    // });
  }, [collections, reset]);

  const submitForm = useCallback(
    async (data: UpdateMultipleCollectionsFormValues, closeAfter = false) => {
      // if (!collection?.id) return;

      // const { id } = collection;
      // if (isDirty) {
      //   if (currentCustodian) {
      //     await updateCollection(id, data.collection, data.config);
      //   } else {
      //     await updateCollectionAdmin(id, data.collection, data.config);
      //   }
      //   notify.success(`Updated collection ${data.collection.name}`);

      //   revalidateAction(TAG_CUSTODIAN_COLLECTION);
      //   if (currentCustodian) {
      //     revalidateAction(getTagCustodianCollection(currentCustodian.pid));
      //   }

      // const newWorkgroups = workgroups
      //   .filter((wg) => workgroupValues.get(wg.name))
      //   .filter(
      //     (wg) =>
      //       (collection.workgroups?.filter((cw) => cw.name === wg.name) || [])
      //         .length === 0
      //   );

      // if (newWorkgroups.length > 0) {
      //   await addCollectionToWorkgroups({
      //     id: id,
      //     workgroup_ids: newWorkgroups.map((wg) => wg.id),
      //   });
      //   notify.success(
      //     `Add collection ${id} to workgroup${
      //       newWorkgroups.length > 1 ? "s" : ""
      //     } ${newWorkgroups.map((wg) => wg.name).join(", ")}`
      //   );
      // }

      // const workgroupsToRemove = workgroups
      //   .filter((wg) => !workgroupValues.get(wg.name))
      //   .filter(
      //     (wg) =>
      //       (collection.workgroups?.filter((cw) => cw.name === wg.name) || [])
      //         .length > 0
      //   );

      // if (workgroupsToRemove.length > 0) {
      //   await removeCollectionFromWorkgroups({
      //     id: id,
      //     workgroup_ids: workgroupsToRemove.map((wg) => wg.id),
      //   });
      //   notify.success(
      //     `Removed collection ${id} from workgroup${
      //       workgroupsToRemove.length > 1 ? "s" : ""
      //     } ${workgroupsToRemove.map((wg) => wg.name).join(", ")}`
      //   );
      // }
      // }

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
      // workgroupValues,
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
    // getDefaultValues,
    updateCollection,
    handleEnter,
    handleLockClick,
    handleUnlockClick,
    submitForm,
  });

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setWorkgroupValues((prev) => {
  //     const updated = new Map(prev);
  //     updated.set(event.target.name, event.target.checked);
  //     return updated;
  //   });
  // };

  // useEffect(() => {
  //   const selectedWorkgroups = Array.from(workgroupValues.entries())
  //     .filter(([_, checked]) => checked)
  //     .map(([name]) => name);
  //   formMethods.setValue("workgroups", selectedWorkgroups, {
  //     shouldDirty: true,
  //     shouldTouch: true,
  //   });
  // }, [workgroupValues, formMethods]);

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

      <ActionMenuSection
        title={"Collection Status"}
        fixedExpanded
        defaultExpanded
        underline
      >
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
      </ActionMenuSection>

      <ActionMenuSection
        title={"Status Guidance"}
        fixedExpanded
        defaultExpanded
        underline
      >
        {/* to-do: implement in a future ticket */}
        Lorem ipsum dolor sit amet,nconsectetur adipiscing elit.
      </ActionMenuSection>

      {/* <ActionMenuSection
        title={"Workgroup access"}
        fixedExpanded
        defaultExpanded
        underline
        accordionSummarySx={{
          mb: 1,
        }}
      >
        <Box>
          {collection.workgroups?.map((w) => (
            <Chip color="secondary" label={w.name} key={`wg-chip-${w.name}`} />
          ))}
        </Box>
        {/* note to self - we should rework table row selection so only clicking the checkbox 
        will add to the multi-select, perhaps along with a shift-click anywhere on the row. 
        This will stop the annoyance of having to click twice on one row to deselect it ahead 
        of selecting the next one
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
      </ActionMenuSection> */}
    </FormProvider>
  );
};

export default UpdateMultipleCollections;
