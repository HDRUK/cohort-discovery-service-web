import { Box, Stack, Button, MenuItem, Chip } from "@mui/material";

import { useForm, Controller } from "react-hook-form";
import { useDaphneStore } from "@/store/useDaphneStore";
import { CreateCollectionFormValues } from "@/types/forms";
import { QueryContext } from "@/types/context";
import FormTextField from "@/components/FormTextField";
import { capitaliseFirstLetter } from "@/utils/string";
import {
  CollectionHost,
  Custodian,
  TaskType,
  FrequencyMode,
} from "@/types/api";
import ActionMenuSection from "@/components/ActionMenuSection";
import { useNotify } from "@/providers/NotifyProvider";
import CollectionConfig from "@/components/CollectionConfig";

interface CollectionFormProps {
  custodian: Custodian;
  collectionHosts: CollectionHost[];
  onCancel?: () => void;
}

const CreateCollection = ({
  custodian,
  collectionHosts,
  onCancel,
}: CollectionFormProps) => {
  const {
    custodianData: { createCollection, createCollectionConfig },
  } = useDaphneStore();
  const notify = useNotify();

  const {
    setValue,
    handleSubmit,
    control,
    reset,
    formState: { isValid, isSubmitting },
  } = useForm<CreateCollectionFormValues>({
    defaultValues: {
      collection: {
        name: "",
        description: "",
        type: QueryContext.BUNNY,
        host_id: 0,
      },
      config: {
        collection_id: 0,
        run_time_hour: 0,
        run_time_minute: 0,
        frequency_mode: FrequencyMode.WEEKLY,
        run_time_frequency: 0,
        enabled: 1,
        type: TaskType.B,
      },
    },
  });

  const onSubmit = async (data: CreateCollectionFormValues) => {
    const createdCollection = await createCollection(
      custodian.pid,
      data.collection
    );
    createCollectionConfig({
      ...data.config,
      collection_id: createdCollection.id,
    });
    notify.success(`Created collection ${createdCollection.name} `);
    onCancel?.();
  };

  return (
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
          <Controller
            name="collection.name"
            control={control}
            rules={{ required: "Name is required" }}
            render={({ field, fieldState }) => (
              <FormTextField
                {...field}
                label="Name"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
                required
              />
            )}
          />

          <Controller
            name="collection.description"
            control={control}
            rules={{ required: "A description is required" }}
            render={({ field, fieldState }) => (
              <FormTextField
                {...field}
                label="Description"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
                required
              />
            )}
          />

          <Controller
            name="collection.url"
            control={control}
            render={({ field, fieldState }) => (
              <FormTextField
                {...field}
                label="Link to Associated Datasets"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />

          <Controller
            name="collection.type"
            control={control}
            rules={{ required: "Query context type is required" }}
            render={({ field, fieldState }) => (
              <FormTextField
                {...field}
                disabled
                select
                label="Query Context Type"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
                required
                slotProps={{
                  htmlInput: {
                    renderValue: (selected: string) => (
                      <Stack direction="row" spacing={1}>
                        <Chip
                          label={capitaliseFirstLetter(selected)}
                          color="primary"
                          size="small"
                        />
                      </Stack>
                    ),
                  },
                }}
              >
                {Object.values(QueryContext).map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    <Chip label={opt} size="small" color="secondary" />
                  </MenuItem>
                ))}
              </FormTextField>
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
            render={({ field, fieldState }) => (
              <FormTextField
                {...field}
                select
                label="Collection Host"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
                required
                slotProps={{
                  htmlInput: {
                    renderValue: (selected: number) => {
                      const selectedHost = collectionHosts.find(
                        (ch) => ch.id === selected
                      );
                      return (
                        <Stack direction="row" spacing={1}>
                          {selectedHost && (
                            <Chip
                              label={capitaliseFirstLetter(selectedHost.name)}
                              color="secondary"
                              size="small"
                            />
                          )}
                        </Stack>
                      );
                    },
                  },
                }}
              >
                <MenuItem value={0} disabled>
                  Select a collection host
                </MenuItem>
                {collectionHosts.map((ch) => (
                  <MenuItem key={ch.id} value={ch.id}>
                    <Chip label={ch.name} size="small" color="secondary" />
                  </MenuItem>
                ))}
              </FormTextField>
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
        <CollectionConfig keepExpanded control={control} setValue={setValue} />
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
        <Button
          type="submit"
          variant="outlined"
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? "Creating..." : "Create"}
        </Button>
      </Stack>
    </Box>
  );
};

export default CreateCollection;
