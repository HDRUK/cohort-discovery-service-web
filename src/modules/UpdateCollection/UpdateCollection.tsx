"use client";
import {
  Chip,
  Box,
  MenuItem,
  Stack,
  FormGroup,
  FormControlLabel,
  Typography,
} from "@mui/material";
import ActionMenuSection from "@/components/ActionMenuSection";
import {
  CollectionStatus,
  CollectionWithHosts,
  frequencyMap,
  FrequencyMode,
  UrlString,
} from "@/types/api";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { REGEX_URL_NO_WWW } from "@/config/regex";
import FormTextField from "@/components/FormTextField";
import CollectionConfig from "@/components/CollectionConfig";
import { UpdateCollectionFormValues } from "@/types/forms";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { revalidateCollections } from "@/actions/revalidate";
import { useNotify } from "@/providers/NotifyProvider";
import FormDropdown from "@/components/FormDropdown";
import DistributionStatus from "../DistributionStatus";
import useCustodianStore from "@/hooks/useCustodianStore";
import FormLabel from "@/components/FormLabel";
import useAdminStore from "@/hooks/useAdminStore";
import removeCollectionFromWorkgroups from "@/actions/workgroup/removeCollectionFromWorkgroups";
import addCollectionToWorkgroups from "@/actions/workgroup/addCollectionToWorkgroups";
import SquareCheckbox from "@/components/SquareCheckbox";
import ManageCollectionStatus from "@/modules/ManageCollectionStatus";
import CopyableVariable from "@/components/CopyableVariable";
import ErrorHeader from "@/components/ErrorHeader";
import { useAdminDataStore } from "@/store/adminDataStore";
import UpdatePanel from "@/components/UpdatePanel";
import { useThreePane } from "@/providers/ThreePaneProvider";
import { FieldConfigMap, useSaveChanges } from "@/hooks/useSaveChanges";
import { useUserDataStore } from "@/hooks/userDataStore";
import { useIsAdminSection } from "@/contexts/AdminSectionContext";
import ToggleSynthetic from "@/components/ToggleSynthetic";
import { getFrequencyModeKey } from "@/utils/frequency";

export type UpdateCollectionProps = {
  collection: CollectionWithHosts;
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
        is_synthetic: false,
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
    is_synthetic,
  } = collection;
  const [host] = hosts;
  return {
    collection: {
      name,
      description: description || "",
      url: url || ("" as UrlString),
      host_id: host?.id ?? "",
      model_state: model_state,
      workgroups: workgroups,
      is_synthetic: is_synthetic,
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

const UpdateCollection = ({ collection }: UpdateCollectionProps) => {
  const { expandedRight, toggleRight: onClose } = useThreePane();

  const currentCustodian = useCustodianStore((s) => s.current.custodian);
  const isAdmin = useIsAdminSection();

  const currentCollectionHosts = useCustodianStore(
    (s) => s.current.collectionHosts,
  );
  const updateCollection = useCustodianStore((s) => s.updateCollection);
  const updateCollectionStatus = useAdminStore((s) => s.updateCollectionStatus);
  const collectionHosts = useAdminDataStore((s) => s.collectionHosts);
  const workgroups = useUserDataStore((s) => s.workgroups);

  const notify = useNotify();

  const workgroupValues = useMemo<Map<string, boolean>>(() => {
    const map = new Map<string, boolean>();
    workgroups.forEach((wg) => {
      map.set(
        wg.name,
        (collection.workgroups?.filter((cw) => cw.id === wg.id) || []).length >
          0,
      );
    });
    return map;
  }, [workgroups, collection.workgroups]);

  const defaultValues = useMemo(
    () => getDefaultValues(collection),
    [collection],
  );

  const formMethods = useForm<UpdateCollectionFormValues>({
    defaultValues: getDefaultValues(collection),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, errors },
  } = formMethods;

  const collectionCustodianPid = collection.custodian.pid;

  const allowedCollectionHosts = useMemo(() => {
    if (isAdmin) {
      return collectionHosts.filter(
        (ch) => ch.custodian.pid === collectionCustodianPid,
      );
    }
    return currentCollectionHosts;
  }, [
    currentCollectionHosts,
    collectionHosts,
    isAdmin,
    collectionCustodianPid,
  ]);

  const lastCollectionIdRef = useRef<number | null>(null);
  useEffect(() => {
    if (!collection) return;

    const ref = lastCollectionIdRef.current;
    if (ref === collection.id) return;
    lastCollectionIdRef.current = collection.id;

    reset(getDefaultValues(collection), {
      keepDirty: false,
      keepTouched: false,
    });
  }, [collection, reset]);

  const submitForm = useCallback(
    async (data: UpdateCollectionFormValues, closeAfter = false) => {
      if (!collection?.id) return;

      const { id, name } = collection;
      if (isDirty) {
        lastCollectionIdRef.current = null;
        await updateCollection(id, data.collection, data.config, false);
        notify.success(`Updated collection ${data.collection.name}`);

        const currentNames = new Set(
          (collection.workgroups ?? []).map((w) => w.name),
        );

        const selectedNames = new Set((data.workgroups ?? []).map(String));

        const toAdd = workgroups.filter(
          (wg) => selectedNames.has(wg.name) && !currentNames.has(wg.name),
        );

        const toRemove = workgroups.filter(
          (wg) => !selectedNames.has(wg.name) && currentNames.has(wg.name),
        );

        if (toAdd.length > 0) {
          await addCollectionToWorkgroups({
            id,
            workgroup_ids: toAdd.map((wg) => wg.id),
          });

          notify.success(
            `Add collection "${name}" to workgroup${
              toAdd.length > 1 ? "s" : ""
            } ${toAdd.map((wg) => wg.name).join(", ")}`,
          );
        }

        if (toRemove.length > 0) {
          await removeCollectionFromWorkgroups({
            id,
            workgroup_ids: toRemove.map((wg) => wg.id),
          });

          notify.success(
            `Removed collection "${name}" from workgroup${
              toRemove.length > 1 ? "s" : ""
            } ${toRemove.map((wg) => wg.name).join(", ")}`,
          );
        }

        const nextStateId = data.collection.model_state?.state?.id;
        if (nextStateId && collection.model_state?.state_id !== nextStateId) {
          await updateCollectionStatus(id, nextStateId);

          notify.success(
            `Changed collection "${name}" to status ${
              CollectionStatus[nextStateId as CollectionStatus]
            }`,
          );
        }

        revalidateCollections(currentCustodian?.pid ?? undefined);
      }

      if (closeAfter) onClose?.();
    },
    [
      collection,
      currentCustodian,
      isDirty,
      notify,
      updateCollection,
      updateCollectionStatus,
      onClose,
      workgroups,
    ],
  );

  const onSave = useCallback(
    () => handleSubmit((values) => submitForm(values, false))(),
    [handleSubmit, submitForm],
  );

  const onDiscard = useCallback(() => {
    reset(defaultValues);
    onClose();
  }, [reset, onClose, defaultValues]);

  const fieldConfig = useMemo<FieldConfigMap>(
    () => ({
      "collection.host_id": {
        label: "Host",
        getValueLabel: (value) =>
          allowedCollectionHosts.find((ch) => ch.id === value)?.name,
      },
      "collection.name": {
        label: "Name",
      },
      "collection.description": {
        label: "Description",
      },
      "collection.url": {
        label: "Link to Associated Dataset",
      },
      "config.frequency_mode": {
        label: "Frequency",
        getValueLabel: (value) => getFrequencyModeKey(String(value)),
      },
      "config.run_time_frequency": {
        label: "Run time Frequency",
        getValueLabel: (value, id, table) => {
          const frequencyMode = id
            ? table?.getRow("config.frequency_mode")?.original?.[id]
            : undefined;

          return frequencyMap[String(frequencyMode) as FrequencyMode][
            Number(value)
          ];
        },
      },
    }),
    [allowedCollectionHosts],
  );

  useSaveChanges<UpdateCollectionFormValues>({
    control,
    entityName: collection.name,
    onSave,
    onDiscard,
    ignoreFields: [
      "collection.model_state.state_id",
      "collection.model_state.state.id",
    ],
    fieldConfig,
  });

  return (
    <UpdatePanel
      label="Collection"
      expandedRight={expandedRight}
      onLockClick={() => handleSubmit((v) => submitForm(v, true))()}
      onUnlockClick={() => onClose?.()}
      rightExtras={<ErrorHeader errors={errors} depth={2} editing />}
    >
      <FormProvider {...formMethods}>
        <FormLabel underlined>Collection Type</FormLabel>
        <ToggleSynthetic disabled={!expandedRight} />

        <FormLabel underlined>Collection Status</FormLabel>
        <ManageCollectionStatus
          collection={collection}
          expandedRight={expandedRight}
          key={collection.id}
        />

        {isAdmin && (
          <>
            <FormLabel underlined>Workgroup access</FormLabel>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                alignItems: "center",
              }}
            >
              {Array.from(workgroupValues.entries()).map(
                ([name, checked]) =>
                  checked && (
                    <Chip
                      color="secondary"
                      label={name}
                      key={`wg-chip-${name}`}
                    />
                  ),
              )}
            </Box>

            {expandedRight && (
              <Controller
                name="workgroups"
                control={control}
                render={({ field }) => {
                  const selected = new Set(field.value ?? []);

                  const toggle = (name: string) => (checked: boolean) => {
                    const next = new Set(selected);
                    if (checked) next.add(name);
                    else next.delete(name);

                    field.onChange(Array.from(next).sort());
                  };

                  return (
                    <FormGroup>
                      {workgroups.map((wg) => {
                        const checked = selected.has(wg.name);

                        return (
                          <FormControlLabel
                            key={wg.id}
                            label={wg.name}
                            control={
                              <SquareCheckbox
                                name={wg.name}
                                checked={checked}
                                onChange={(e) =>
                                  toggle(wg.name)(e.target.checked)
                                }
                                disabled={!expandedRight}
                              />
                            }
                          />
                        );
                      })}
                    </FormGroup>
                  );
                }}
              />
            )}
          </>
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

          <Box
            sx={{
              borderColor: "text.secondary",
              borderWidth: 1,
              borderStyle: "solid",
              p: 1,
            }}
          >
            <Typography
              sx={{ color: "secondary.main", mb: 1, fontWeight: "bold" }}
            >
              You will need to copy the following credentials into your Bunny/
              BC|Insight setup
            </Typography>
            <Stack>
              <FormLabel underlined>Collection ID</FormLabel>
              <CopyableVariable value={collection.pid} sx={{ mb: 2 }} />
            </Stack>
            <Stack>
              <FormLabel underlined>Task API_BASE_URL</FormLabel>
              <CopyableVariable
                value={process.env.NEXT_PUBLIC_TASK_URL as string}
                sx={{ mb: 2 }}
              />
            </Stack>
            {!isAdmin && (
              <Stack>
                <FormLabel underlined>Host Credentials</FormLabel>
                Client ID
                <CopyableVariable
                  value={collection.host?.[0]?.client_id}
                  sx={{ mb: 2 }}
                />
                Client Secret
                <CopyableVariable
                  hidden
                  value={collection.host?.[0]?.client_secret}
                  sx={{ mb: 2 }}
                />
              </Stack>
            )}
          </Box>

          <Stack>
            <FormLabel underlined>Collection Connection</FormLabel>
            <Controller
              disabled={!expandedRight}
              name="collection.host_id"
              control={control}
              rules={{
                required: "A collection host is required",
                validate: (value) =>
                  Number(value) > 0 || "Please select a valid collection host",
              }}
              render={({ field, fieldState: { error } }) => {
                if (expandedRight) {
                  return (
                    <FormDropdown
                      {...field}
                      select
                      label={fieldConfig[field.name].label}
                      id={field.name}
                      error={error}
                      fullWidth
                      required
                      placeHolderOption={
                        <MenuItem value={0} disabled>
                          Select a collection host
                        </MenuItem>
                      }
                      options={allowedCollectionHosts.map((ch) => ({
                        label: ch.name,
                        value: ch.id,
                      }))}
                      chipColor="secondary"
                    />
                  );
                }

                return (
                  <Chip
                    label={
                      allowedCollectionHosts.find((ch) => ch.id === field.value)
                        ?.name
                    }
                    color="secondary"
                    sx={{ width: "fit-content" }}
                  />
                );
              }}
            />
          </Stack>

          <Controller
            disabled={!expandedRight}
            name="collection.url"
            control={control}
            rules={{
              required: "URL is required",
              pattern: {
                value: REGEX_URL_NO_WWW,
                message: "Enter a valid URL (including http(s):// )",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <FormTextField
                copyable
                {...field}
                label={fieldConfig[field.name].label}
                labelUnderlined
                error={error}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onSave();
                  }
                }}
              />
            )}
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
                id={field.name}
                label={fieldConfig[field.name].label}
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
                id={field.name}
                label={fieldConfig[field.name].label}
                error={error}
                fullWidth
                labelUnderlined
                required
              />
            )}
          />
        </ActionMenuSection>

        <ActionMenuSection
          gap={2}
          title={"Collection Configuration"}
          fixedExpanded
          defaultExpanded
          accordionSummarySx={{
            mt: 2,
          }}
        >
          <DistributionStatus
            disabled={!expandedRight}
            collection={collection}
          />
          <CollectionConfig disabled={!expandedRight} keepExpanded />
        </ActionMenuSection>
      </FormProvider>
    </UpdatePanel>
  );
};

export default UpdateCollection;
