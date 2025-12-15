"use client";
import { Typography, IconButton, Chip, Box, MenuItem } from "@mui/material";
import LockOutlineIcon from "@mui/icons-material/LockOutline";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ActionMenuSection from "@/components/ActionMenuSection";
import {
  CollectionHost,
  CollectionWithHosts,
  FrequencyMode,
  UrlString,
} from "@/types/api";
import { Controller, FormProvider, useForm } from "react-hook-form";
import AddButton from "@/components/AddButton";
import FormTextField from "@/components/FormTextField";
import CollectionConfig from "@/components/CollectionConfig";
import { UpdateCollectionFormValues } from "@/types/forms";
import { useEffect } from "react";
import { useDaphneStore } from "@/store/useDaphneStore";
import { revalidateAction } from "@/actions/revalidate";
import { useNotify } from "@/providers/NotifyProvider";
import FormDropdown from "@/components/FormDropdown";
import DistributionStatus from "../DistrubutionStatus";

export type UpdateCollectionProps = {
  selectedCollection: CollectionWithHosts;
  collectionHosts: CollectionHost[];
  expandedRight: boolean;
  expandedLeft: boolean;
  onClose?: () => void;
};

const UpdateCollection = ({
  selectedCollection,
  collectionHosts,
  expandedRight,
  onClose,
}: UpdateCollectionProps) => {
  const {
    custodianData: { currentCustodian, updateCollection },
  } = useDaphneStore();
  const notify = useNotify();

  const formMethods = useForm<UpdateCollectionFormValues>({
    defaultValues: {
      collection: { name: "", description: "", url: "", host_id: 0 },
      config: {
        frequency_mode: Number(FrequencyMode.WEEKLY),
        run_time_frequency: 0,
        run_time_hour: 0,
        run_time_minute: 0,
      },
    },
  });

  const { control, handleSubmit, reset } = formMethods;

  useEffect(() => {
    if (!selectedCollection) return;

    const { name, description, url, host: hosts, config } = selectedCollection;
    const [host] = hosts;

    const newValues = {
      collection: {
        name,
        description: description || "",
        url: url || ("" as UrlString),
        host_id: host.id,
      },
      config: {
        frequency_mode: config.frequency_mode,
        run_time_frequency: config.run_time_frequency,
        // run_time_hour: config.run_time_hour 0,
        // run_time_minute: config.run_time_minute ?? 0,
      },
    };

    reset(newValues, {
      keepDirty: false,
      keepTouched: false,
    });
  }, [selectedCollection, reset]);
  const submitForm = async (
    data: UpdateCollectionFormValues,
    closeAfter = false
  ) => {
    if (!selectedCollection?.id) return;

    const { id } = selectedCollection;

    await updateCollection(id, data.collection, data.config);
    notify.success(`Updated collection ${data.collection.name}`);

    if (currentCustodian) {
      revalidateAction(`collections-${currentCustodian.pid}`);
    }

    if (closeAfter) {
      onClose?.();
    }
  };

  const handleEnter = handleSubmit((values) => submitForm(values, false));
  const handleLockClick = handleSubmit((values) => submitForm(values, true));
  const handleUnlockClick = () => {
    onClose?.();
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
        {/* to-do: implement in a future ticket */}
        <AddButton
          disabled
          label={"Request to make active"}
          action={() => ({})}
        />
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
        {/* to-do: implement in a future ticket */}
        <Box>
          <Chip color="secondary" label="To-Do" />
        </Box>
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
          value={selectedCollection.pid}
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
      </ActionMenuSection>

      <ActionMenuSection
        title={"Collection Configuration"}
        fixedExpanded
        defaultExpanded
        underline
      >
        <DistributionStatus collection={selectedCollection} />
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
