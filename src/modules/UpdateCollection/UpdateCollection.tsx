"use client";
import {
  Typography,
  IconButton,
  Chip,
  Box,
  MenuItem,
  Stack,
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
import FormTextField from "@/components/FormTextField";
import CollectionConfig from "@/components/CollectionConfig";
import { UpdateCollectionFormValues } from "@/types/forms";
import { useCallback, useEffect, useRef, useState } from "react";
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
import FormLabel from "@/components/FormLabel";
import { maskClientTest } from "@/lib/maskClientTest";
import transitionCollection from "@/actions/transitionCollection";
import useAdminStore from "@/store/useAdminStore";
import removeCollectionFromWorkgroups from "@/actions/removeCollectionFromWorkgroups";
import addCollectionToWorkgroups from "@/actions/addCollectionToWorkgroups";
import SquareCheckbox from "@/components/SquareCheckbox";
import ManageCollectionStatus from "../ManageCollectionStatus";

const UpdateCollectionGuidance = maskClientTest(
  () => import("./UpdateCollectionGuidance")
);

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
    workgroups: workgroups?.map((wg) => wg.name).sort(),
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
  const firstUpdate = useRef(true);

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

        const cwNames = new Set(
          (collection.workgroups ?? []).map((w) => w.name)
        );

        const newWorkgroups = workgroups.filter(
          (wg) => workgroupValues.get(wg.name) && !cwNames.has(wg.name)
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

        const workgroupsToRemove = workgroups.filter(
          (wg) => !workgroupValues.get(wg.name) && cwNames.has(wg.name)
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

        if (
          data.collection.model_state?.state.id &&
          collection.model_state?.state_id !==
            data.collection.model_state?.state.id
        ) {
          await transitionCollection(id, {
            state:
              CollectionStatus[
                data.collection.model_state.state.id
              ].toLowerCase(),
          });
          notify.success(
            `Transitioned collection ${id} to status ${
              CollectionStatus[
                data.collection.model_state.state.id as CollectionStatus
              ]
            }`
          );
        }
      }

      if (closeAfter) {
        onClose?.();
      }
    },
    [
      collection,
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
    () => handleSubmit((values) => submitForm(values, false))(),
    [handleSubmit, submitForm]
  );

  const handleLockClick = useCallback(
    () => handleSubmit((values) => submitForm(values, true))(),
    [handleSubmit, submitForm]
  );

  const { setValue } = formMethods;

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
    setValue("workgroups", selectedWorkgroups.sort(), {
      shouldDirty: !firstUpdate.current,
      shouldTouch: !firstUpdate.current,
    });
    firstUpdate.current = false;
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

      <FormLabel underlined>Collection Status</FormLabel>

      <ManageCollectionStatus
        collection={collection}
        expandedRight={expandedRight}
        key={collection.id}
        control={control}
        setValue={setValue}
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
        {collection.workgroups?.map((w) => (
          <Chip color="secondary" label={w.name} key={`wg-chip-${w.name}`} />
        )) ??
          (!expandedRight && "No workgroups set")}
      </Box>

      {expandedRight && (
        <Controller
          name="workgroups"
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
      )}

      <ActionMenuSection
        gap={2}
        title={"Collection Credentials"}
        fixedExpanded
        defaultExpanded
        accordionSummarySx={{
          mt: 2,
        }}
      >
        {/* missing in the BE - ticket created
        <FormTextField
        value={collection.custodian.url}
          copyable
          label="Link to Custodian Page"
          labelUnderlined
        />
        */}

        <FormTextField
          labelUnderlined
          copyable
          disabled
          value={collection.pid}
          label="Collection ID"
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
              labelUnderlined
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

        <Stack>
          <FormLabel underlined>Collection Connection</FormLabel>
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
                label="Host"
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
        </Stack>

        <Stack>
          <FormLabel underlined>Host Credentials</FormLabel>

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
        </Stack>
      </ActionMenuSection>

      <ActionMenuSection
        gap={2}
        title={"Collection Distributions"}
        fixedExpanded
        defaultExpanded
        accordionSummarySx={{
          mt: 2,
        }}
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

      <ActionMenuSection
        gap={2}
        title={"Collection Info"}
        fixedExpanded
        defaultExpanded
        accordionSummarySx={{
          mt: 2,
        }}
      >
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
              labelUnderlined
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
              labelUnderlined
              required
            />
          )}
        />
        {/* supposed to also have supoprt contact / adminstractive contact */}
        <UpdateCollectionGuidance />
      </ActionMenuSection>
    </FormProvider>
  );
};

export default UpdateCollection;
