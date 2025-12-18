import { Box, Stack, Button, MenuItem } from "@mui/material";

import { useForm, Controller, FormProvider } from "react-hook-form";
import { CreateCollectionFormValues } from "@/types/forms";
import { QueryContext } from "@/types/context";
import FormTextField from "@/components/FormTextField";
import {
  CollectionHost,
  Custodian,
  TaskType,
  FrequencyMode,
} from "@/types/api";
import ActionMenuSection from "@/components/ActionMenuSection";
import { useNotify } from "@/providers/NotifyProvider";
import CollectionConfig from "@/components/CollectionConfig";
import { REGEX_URL_NO_WWW } from "@/config/regex";
import FormDropdown from "@/components/FormDropdown";
import { v4 as uuidv4 } from "uuid";
import useAdminStore from "@/store/useAdminStore";
import useCustodianStore from "@/store/useCustodianStore";

interface CreateCollectionProps {
  collectionHosts: CollectionHost[];
  custodians?: Custodian[];
  onCancel?: () => void;
}

const CreateCollection = ({
  collectionHosts,
  custodians,
  onCancel,
}: CreateCollectionProps) => {
  const createCollectionAdmin = useAdminStore((s) => s.createCollection);
  const createCollection = useCustodianStore((s) => s.createCollection);
  const currentCustodian = useCustodianStore((s) => s.currentCustodian);

  const notify = useNotify();

  const formMethods = useForm<CreateCollectionFormValues>({
    defaultValues: {
      collection: {
        name: "",
        description: "",
        url: "",
        type: QueryContext.BUNNY,
        host_id: 0,
        custodian_id: "",
        status: true,
      },
      config: {
        collection_id: 0,
        run_time_hour: 0,
        run_time_minute: 0,
        frequency_mode: Number(FrequencyMode.WEEKLY),
        run_time_frequency: 0,
        enabled: 1,
        type: TaskType.B,
      },
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = formMethods;

  const onSubmit = async (data: CreateCollectionFormValues) => {
    data.collection.pid = uuidv4();
    const createdCollection = currentCustodian
      ? await createCollection(
          currentCustodian.pid,
          data.collection,
          data.config
        )
      : await createCollectionAdmin(data.collection, data.config);

    notify.success(`Created collection ${createdCollection.name}`);
    onCancel?.();
  };

  return (
    <FormProvider {...formMethods}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          mt: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          mb: 5,
        }}
      >
        <ActionMenuSection
          title={"New Collection"}
          fixedExpanded
          defaultExpanded
          underline
        >
          <Stack spacing={2} width={"70%"} height={"100%"}>
            {!currentCustodian && !!custodians && (
              <Controller
                name="collection.custodian_id"
                control={control}
                rules={{ required: "Custodian is required" }}
                render={({ field, fieldState: { error } }) => (
                  <FormDropdown
                    {...field}
                    select
                    label="Custodian"
                    error={error}
                    fullWidth
                    required
                    options={Object.values(custodians).map((opt) => ({
                      value: opt.id,
                      label: opt.name.toUpperCase(),
                    }))}
                  />
                )}
              />
            )}
            <Controller
              name="collection.name"
              control={control}
              rules={{ required: "Name is required" }}
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
              name="collection.url"
              control={control}
              rules={{
                required: "A link to this associated dataset(s) is required",
                pattern: {
                  value: REGEX_URL_NO_WWW,
                  message: "Enter a valid URL (including http(s):// )",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <FormTextField
                  {...field}
                  error={error}
                  required
                  label="Link to Associated Datasets"
                  fullWidth
                />
              )}
            />
            <Controller
              name="collection.type"
              control={control}
              rules={{ required: "Query context type is required" }}
              render={({ field, fieldState: { error } }) => (
                <FormDropdown
                  {...field}
                  disabled
                  select
                  label="Query Context Type"
                  error={error}
                  fullWidth
                  required
                  options={Object.values(QueryContext).map((opt) => ({
                    value: opt,
                    label: opt.toUpperCase(),
                  }))}
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
          </Stack>
        </ActionMenuSection>

        <ActionMenuSection
          title={"Collection Configuration"}
          fixedExpanded
          defaultExpanded
          underline
        >
          <CollectionConfig<CreateCollectionFormValues>
            keepExpanded
            frequencyFieldName={"config.frequency_mode"}
            runTimeFrequencyFieldName={"config.run_time_frequency"}
            runTimeHourFieldName={"config.run_time_hour"}
            runTimeMinuteFieldName={"config.run_time_minute"}
          />
        </ActionMenuSection>

        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button
            type="button"
            onClick={() => {
              onCancel?.();
              reset();
            }}
            disabled={isSubmitting}
            variant="contained"
            sx={{ bgcolor: "background.default", color: "text.primary" }}
          >
            Cancel
          </Button>
          <Button type="submit" variant="outlined" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create"}
          </Button>
        </Stack>
      </Box>
    </FormProvider>
  );
};

export default CreateCollection;
