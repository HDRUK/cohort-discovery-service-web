import { Box, Stack, Button, MenuItem } from "@mui/material";
import { useForm, Controller, FormProvider, useWatch } from "react-hook-form";
import { CreateCollectionFormValues } from "@/types/forms";
import { QueryContext } from "@/types/context";
import FormTextField from "@/components/FormTextField";
import { TaskType, FrequencyMode } from "@/types/api";
import ActionMenuSection from "@/components/ActionMenuSection";
import { useNotify } from "@/providers/NotifyProvider";
import CollectionConfig from "@/components/CollectionConfig";
import { REGEX_URL_NO_WWW } from "@/config/regex";
import FormDropdown from "@/components/FormDropdown";
import useCustodianStore from "@/hooks/useCustodianStore";
import { useEffect, useMemo } from "react";
import ErrorHeader from "@/components/ErrorHeader";
import { useUserDataStore } from "@/hooks/userDataStore";
import { useAdminDataStore } from "@/store/adminDataStore";

interface CreateCollectionProps {
  onCancel?: () => void;
}

const CreateCollection = ({ onCancel }: CreateCollectionProps) => {
  const createCollection = useCustodianStore((s) => s.createCollection);
  const currentCustodian = useCustodianStore((s) => s.current.custodian);
  const currentCollectionHosts = useCustodianStore(
    (s) => s.current.collectionHosts,
  );
  const collectionHosts = useAdminDataStore((s) => s.collectionHosts);
  const custodians = useUserDataStore((s) => s.custodians);

  const isAdmin = !currentCustodian;

  const notify = useNotify();

  const formMethods = useForm<CreateCollectionFormValues>({
    defaultValues: {
      custodian_pid: currentCustodian?.pid ?? "",
      collection: {
        name: "",
        description: "",
        url: "",
        type: QueryContext.BUNNY,
        host_id: 0,
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
    resetField,
    formState: { isSubmitting, errors },
  } = formMethods;

  const selectedCustodianPid = useWatch({ name: "custodian_pid", control });
  const selectedHostId = useWatch({ name: "collection.host_id", control });

  const allowedCollectionHosts = useMemo(() => {
    if (isAdmin) {
      return collectionHosts.filter(
        (ch) => ch.custodian.pid === selectedCustodianPid,
      );
    }
    return currentCollectionHosts;
  }, [currentCollectionHosts, collectionHosts, isAdmin, selectedCustodianPid]);

  useEffect(() => {
    resetField("collection.host_id", { defaultValue: 0 });
  }, [allowedCollectionHosts, resetField]);

  const onSubmit = async (data: CreateCollectionFormValues) => {
    const createdCollection = await createCollection(
      data.custodian_pid,
      data.collection,
      data.config,
    );

    notify.success(`Created collection ${createdCollection.name}`);
    onCancel?.();
  };

  return (
    <FormProvider {...formMethods}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          pb: 5,
        }}
      >
        <Stack spacing={2} width={"70%"} height={"100%"}>
          <ActionMenuSection
            title={"New Collection"}
            fixedExpanded
            defaultExpanded
            underline
            accordionSummarySx={{ mb: 2 }}
          >
            <ErrorHeader errors={errors} depth={2} />
            {!currentCustodian && !!custodians && (
              <Controller
                name="custodian_pid"
                control={control}
                rules={{ required: "Custodian is required" }}
                render={({ field, fieldState: { error } }) => (
                  <FormDropdown
                    {...field}
                    select
                    label="Custodian"
                    id={field.name}
                    error={error}
                    fullWidth
                    required
                    options={Object.values(custodians).map((opt) => ({
                      value: opt.pid,
                      label: opt.name.toUpperCase(),
                    }))}
                  />
                )}
              />
            )}
            <Controller
              name="collection.host_id"
              control={control}
              rules={{
                required: "A collection host is required",
                validate: (value) =>
                  Number(value) > 0 || "Please select a valid collection host",
              }}
              disabled={!selectedCustodianPid}
              render={({ field, fieldState: { error } }) => (
                <FormDropdown
                  {...field}
                  select
                  label="Collection Host"
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
              )}
            />

            <Controller
              name="collection.name"
              control={control}
              rules={{ required: "Name is required" }}
              disabled={!selectedHostId}
              render={({ field, fieldState: { error } }) => (
                <FormTextField
                  {...field}
                  label="Name"
                  id={field.name}
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
              disabled={!selectedHostId}
              render={({ field, fieldState: { error } }) => (
                <FormTextField
                  {...field}
                  label="Description"
                  id={field.name}
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
              disabled={!selectedHostId}
              render={({ field, fieldState: { error } }) => (
                <FormTextField
                  {...field}
                  error={error}
                  required
                  label="Link to Associated Datasets"
                  id={field.name}
                  fullWidth
                />
              )}
            />
            {/* // component disabled anyway, it should not be shown
            <Controller
              name="collection.type"
              control={control}
              rules={{ required: "Query context type is required" }}
              disabled={!selectedHostId}
              render={({ field, fieldState: { error } }) => (
                <FormDropdown
                  {...field}
                  disabled
                  select
                  label="Query Context Type"
                  id={field.name}
                  error={error}
                  fullWidth
                  required
                  options={Object.values(QueryContext).map((opt) => ({
                    value: opt,
                    label: opt.toUpperCase(),
                  }))}
                />
              )}
            />*/}
          </ActionMenuSection>

          <ActionMenuSection
            title={"Collection Configuration"}
            fixedExpanded
            defaultExpanded
          >
            <CollectionConfig<CreateCollectionFormValues>
              keepExpanded
              frequencyFieldName={"config.frequency_mode"}
              runTimeFrequencyFieldName={"config.run_time_frequency"}
              runTimeHourFieldName={"config.run_time_hour"}
              runTimeMinuteFieldName={"config.run_time_minute"}
              disabled={!selectedHostId}
            />
          </ActionMenuSection>
        </Stack>

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
          <Button
            type="submit"
            variant="outlined"
            disabled={isSubmitting || !selectedHostId}
          >
            {isSubmitting ? "Creating..." : "Create"}
          </Button>
        </Stack>
      </Box>
    </FormProvider>
  );
};

export default CreateCollection;
