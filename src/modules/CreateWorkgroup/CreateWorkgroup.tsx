import { Box, Stack, Button } from "@mui/material";

import { useForm, Controller, FormProvider } from "react-hook-form";
import { useDaphneStore } from "@/store/useDaphneStore";
import { CreateWorkgroupFormValues } from "@/types/forms";
import FormTextField from "@/components/FormTextField";
import { Collection } from "@/types/api";
import ActionMenuSection from "@/components/ActionMenuSection";
import { useNotify } from "@/providers/NotifyProvider";

import FormMultiSelect from "@/components/FormMultiSelect";
import addCollectionToWorkgroup from "@/actions/addCollectionToWorkgroup";
import { ValueType } from "@/components/FormMultiSelect/FormMultiSelect";

interface CreateCollectionProps {
  collections?: Collection[];
  onCancel?: () => void;
}

const CreateWorkgroup = ({ collections, onCancel }: CreateCollectionProps) => {
  const {
    adminData: { createWorkgroup },
  } = useDaphneStore();
  const notify = useNotify();

  const formMethods = useForm<CreateWorkgroupFormValues>({
    defaultValues: {
      name: "",
      collections: [],
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = formMethods;

  const onSubmit = async (data: CreateWorkgroupFormValues) => {
    const createdWorkgroup = await createWorkgroup({
      name: data.name,
      active: true, // hardoded until/unless we add active field to form
    });

    if (data.collections.length > 0) {
      data.collections.map(async (collection) => {
        await addCollectionToWorkgroup({
          id: +collection.value,
          workgroup_id: createdWorkgroup.id,
        });
      });
    }

    notify.success(`Created workgroup ${createdWorkgroup.name}`);

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
          title={"New Workgroup"}
          fixedExpanded
          defaultExpanded
          underline
        >
          <Stack spacing={2} width={"70%"} height={"100%"} sx={{ py: 1 }}>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Name is required" }}
              render={({ field, fieldState: { error } }) => (
                <FormTextField
                  {...field}
                  label="Workgroup name"
                  error={error}
                  fullWidth
                  required
                  sx={{ pt: 1 }}
                />
              )}
            />
            <Controller
              name="collections"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormMultiSelect
                  {...field}
                  label={"Add collections"}
                  placeholder="Search and add approved collections..."
                  multiple
                  options={
                    collections?.map((c) => ({
                      label: c.name,
                      value: c.id as ValueType,
                    })) || []
                  }
                  getChipLabel={(options, value) =>
                    options.find((option) => option.value === value.value)
                      ?.label || ""
                  }
                  tagsBelow
                  error={error}
                  sx={{ pt: 1 }}
                />
              )}
            />
          </Stack>
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

export default CreateWorkgroup;
