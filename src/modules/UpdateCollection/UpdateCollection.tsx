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
import { UpdateCollectionFormValues } from "@/types/forms";
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
import transitionCollection from "@/actions/transitionCollection";
import { CollectionFilterStatus } from "@/types/collections";
import useAdminStore from "@/store/useAdminStore";
import removeCollectionFromWorkgroups from "@/actions/removeCollectionFromWorkgroups";
import addCollectionToWorkgroups from "@/actions/addCollectionToWorkgroups";

export type UpdateCollectionProps = {
  collection: CollectionWithHosts;
  collectionHosts: CollectionHost[];
  workgroups: Workgroup[];
  expandedRight: boolean;
  expandedLeft: boolean;
  onClose?: () => void;
};

const getDefaultValues = (collection: CollectionWithHosts | null) => {
  if (!collection) {
    return {
      collection: {
        name: "",
        description: "",
        url: "" as UrlString,
        host_id: 0,
        model_state: undefined,
        workgroups: [],
      },
      config: {
        frequency_mode: Number(FrequencyMode.WEEKLY),
        run_time_frequency: 0,
        run_time_hour: 0,
        run_time_minute: 0,
      },
    };
  }

  const {
    name,
    description,
    url,
    host: hosts,
    config,
    model_state,
    workgroups,
  } = collection;
  const [host] = hosts;
  return {
    collection: {
      name,
      description: description || "",
      url: url || ("" as UrlString),
      host_id: host.id,
      model_state: model_state,
      workgroups: workgroups,
    },
    config: {
      frequency_mode: config.frequency_mode,
      run_time_frequency: config.run_time_frequency,
      run_time_hour: config.run_time_hour ?? 0,
      run_time_minute: config.run_time_minute ?? 0,
    },
  };
};

const UpdateCollection = ({
  collection,
  collectionHosts,
  workgroups,
  expandedRight,
  onClose,
}: UpdateCollectionProps) => {
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
          (collection.workgroups?.filter((cw) => cw.id === wg.id) || [])
            .length > 0
        );
      });
      return map;
    }
  );

  const formMethods = useForm<UpdateCollectionFormValues>({
    defaultValues: getDefaultValues(collection),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = formMethods;

  useEffect(() => {
    if (!collection) return;

    const newValues = getDefaultValues(collection);

    reset(newValues, {
      keepDirty: false,
      keepTouched: false,
    });
  }, [collection, reset]);

  const submitForm = useCallback(
    async (data: UpdateCollectionFormValues, closeAfter = false) => {
      if (!collection?.id) return;

      const { id } = collection;
      if (isDirty) {
        if (currentCustodian) {
          await updateCollection(id, data.collection, data.config);
        } else {
          await updateCollectionAdmin(id, data.collection, data.config);
        }
        notify.success(`Updated collection ${data.collection.name}`);

        revalidateAction(TAG_CUSTODIAN_COLLECTION);
        if (currentCustodian) {
          revalidateAction(getTagCustodianCollection(currentCustodian.pid));
        }

        const newWorkgroups = workgroups
          .filter((wg) => workgroupValues.get(wg.name))
          .filter(
            (wg) =>
              (collection.workgroups?.filter((cw) => cw.name === wg.name) || [])
                .length === 0
          );

        if (newWorkgroups.length > 0) {
          await addCollectionToWorkgroups({
            id: id,
            workgroup_ids: newWorkgroups.map((wg) => wg.id),
          });
          notify.success(
            `Add collection ${id} to workgroup${
              newWorkgroups.length > 1 ? "s" : ""
            } ${newWorkgroups.map((wg) => wg.name).join(", ")}`
          );
        }

        const workgroupsToRemove = workgroups
          .filter((wg) => !workgroupValues.get(wg.name))
          .filter(
            (wg) =>
              (collection.workgroups?.filter((cw) => cw.name === wg.name) || [])
                .length > 0
          );

        if (workgroupsToRemove.length > 0) {
          await removeCollectionFromWorkgroups({
            id: id,
            workgroup_ids: workgroupsToRemove.map((wg) => wg.id),
          });
          notify.success(
            `Removed collection ${id} from workgroup${
              workgroupsToRemove.length > 1 ? "s" : ""
            } ${workgroupsToRemove.map((wg) => wg.name).join(", ")}`
          );
        }
      }

      if (closeAfter) {
        onClose?.();
      }
    },
    [collection, currentCustodian, isDirty, notify, updateCollection, onClose]
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

  useLogDependencyChanges("UpdateCollection", {
    collection,
    collectionHosts,
    ...formMethods,
    currentCustodian,
    getDefaultValues,
    updateCollection,
    handleEnter,
    handleLockClick,
    handleUnlockClick,
    submitForm,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedWorkgroupValues = workgroupValues;

    updatedWorkgroupValues.set(event.target.name, event.target.checked);
    setWorkgroupValues(updatedWorkgroupValues);
  };

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
        Collection
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
        {collection?.model_state?.state_id != CollectionStatus.DRAFT && (
          <Box>
            <StatusChip
              state_id={collection?.model_state?.state_id}
              sx={{ my: 1 }}
            />
          </Box>
        )}
        {collection?.model_state?.state_id == CollectionStatus.DRAFT &&
          collection?.model_state?.state && (
            <AddButton
              label={"Request to make active"}
              action={() => {
                const $result = transitionCollection(collection.id, {
                  state: CollectionFilterStatus.PENDING,
                });
                console.log("result", $result);
                notify.success(
                  `Requested for collection "${collection.name}" to be made active`
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

      <ActionMenuSection
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
        of selecting the next one */}
        <Controller
          name="workgroups"
          disabled={!expandedRight}
          control={control}
          render={({ field }) => {
            return (
              <FormGroup {...field}>
                <Box display="flex" flexDirection="column">
                  {workgroups?.map((w) => (
                    <FormControlLabel
                      disabled={!expandedRight}
                      control={
                        <Checkbox
                          checked={
                            //use .some
                            (
                              collection.workgroups?.filter(
                                (cw) => cw.id === w.id
                              ) || []
                            ).length > 0
                          }
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
      </ActionMenuSection>

      <ActionMenuSection
        title={"Collection Info"}
        fixedExpanded
        defaultExpanded
        underline
        accordionSummarySx={{
          mb: 1,
        }}
      >
        <FormTextField
          copyable
          disabled
          value={collection.pid}
          label="Identifier"
        />
        <Controller
          name="collection.name"
          disabled={!expandedRight}
          control={control}
          rules={{ required: "A name is required" }}
          render={({ field, fieldState: { error } }) => (
            <FormTextField
              {...field}
              label="Name"
              error={error}
              fullWidth
              required
            />
          )}
        />
        <Controller
          name="collection.description"
          disabled={!expandedRight}
          control={control}
          rules={{ required: "A description is required" }}
          render={({ field, fieldState: { error } }) => (
            <FormTextField
              {...field}
              label="Description"
              error={error}
              fullWidth
              required
            />
          )}
        />
        <Controller
          disabled={!expandedRight}
          name="collection.url"
          control={control}
          rules={{ required: "URL is required" }}
          render={({ field, fieldState: { error } }) => (
            <FormTextField
              copyable
              {...field}
              label="Link to Associated Dataset"
              error={error}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleEnter();
                }
              }}
            />
          )}
        />
        <Controller
          name="collection.host_id"
          control={control}
          rules={{
            required: "A collection host is required",
            validate: (value) =>
              Number(value) > 0 || "Please select a valid collection host",
          }}
          render={({ field, fieldState: { error } }) => (
            <FormDropdown
              {...field}
              select
              label="Collection Host"
              error={error}
              fullWidth
              required
              placeHolderOption={
                <MenuItem value={0} disabled>
                  Select a collection host
                </MenuItem>
              }
              options={collectionHosts.map((ch) => ({
                label: ch.name,
                value: ch.id,
              }))}
              chipColor="secondary"
            />
          )}
        />

        <FormTextField
          copyable
          disabled
          value={collection.host?.[0]?.client_id}
          label="Client ID"
        />
        <FormTextField
          type="password"
          copyable
          disabled
          value={collection.host?.[0]?.client_secret}
          label="Client Secret"
        />
      </ActionMenuSection>

      <ActionMenuSection
        title={"Collection Configuration"}
        fixedExpanded
        defaultExpanded
        underline
      >
        <DistributionStatus disabled={!expandedRight} collection={collection} />
        <CollectionConfig<UpdateCollectionFormValues>
          disabled={!expandedRight}
          keepExpanded
          frequencyFieldName={"config.frequency_mode"}
          runTimeFrequencyFieldName={"config.run_time_frequency"}
          runTimeHourFieldName={"config.run_time_hour"}
          runTimeMinuteFieldName={"config.run_time_minute"}
        />
      </ActionMenuSection>
    </FormProvider>
  );
};

export default UpdateCollection;
