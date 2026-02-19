import { Box, Stack, Button } from "@mui/material";

import { useForm, Controller, FormProvider } from "react-hook-form";
import { CreateNetworkFormValues } from "@/types/forms";
import FormTextField from "@/components/FormTextField";
import ActionMenuSection from "@/components/ActionMenuSection";
import { useNotify } from "@/providers/NotifyProvider";

import FormMultiSelect from "@/components/FormMultiSelect";
import { ValueType } from "@/components/FormMultiSelect/FormMultiSelect";
import useAdminStore from "@/hooks/useAdminStore";
import useUserStore from "@/hooks/useUserStore";
import { REGEX_URL_NO_WWW } from "@/config/regex";

interface CreateCollectionProps {
  onCancel?: () => void;
}

const CreateNetwork = ({ onCancel }: CreateCollectionProps) => {
  const createNetwork = useAdminStore((s) => s.createNetwork);
  const networks = useAdminStore((s) => s.networks);
  const custodians = useUserStore((s) => s.custodians);
  const addCustodiansToNetwork = useAdminStore((s) => s.addCustodiansToNetwork);

  const notify = useNotify();

  const formMethods = useForm<CreateNetworkFormValues>({
    defaultValues: {
      name: "",
      url: "",
      custodians: [],
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = formMethods;

  const onSubmit = async (data: CreateNetworkFormValues) => {
    const createdNetwork = await createNetwork({
      name: data.name,
      url: data.url,
    });

    if (data.custodians.length > 0) {
      await addCustodiansToNetwork({
        custodian_ids: data.custodians.map((c) => +c.value),
        id: createdNetwork.id,
      });
    }

    notify.success(`Created network ${createdNetwork.name}`);

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
          title={"New Network"}
          fixedExpanded
          defaultExpanded
          underline
        >
          <Stack spacing={2} width={"70%"} height={"100%"} sx={{ py: 1 }}>
            <Controller
              name="name"
              control={control}
              rules={{
                required: "A network name is required",
                validate: (value) => {
                  const v = value?.trim().toLowerCase();
                  if (!v) return true;

                  const exists = (networks ?? []).some(
                    (n) => (n.name ?? "").trim().toLowerCase() === v,
                  );

                  return exists
                    ? "A network with this name already exists"
                    : true;
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <FormTextField
                  {...field}
                  label="Network name"
                  error={error}
                  fullWidth
                  required
                  sx={{ pt: 1 }}
                />
              )}
            />

            <Controller
              name="url"
              control={control}
              rules={
                {
                  /*required: "A link to this network is required",
                pattern: {
                  value: REGEX_URL_NO_WWW,
                  message: "Enter a valid URL (including http(s):// )",
                },*/
                }
              }
              render={({ field, fieldState: { error } }) => (
                <FormTextField
                  {...field}
                  label="Network url"
                  error={error}
                  fullWidth
                  required={false}
                  sx={{ pt: 1 }}
                />
              )}
            />

            <Controller
              name="custodians"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormMultiSelect
                  {...field}
                  label={"Add custodians"}
                  placeholder="Search custodians..."
                  multiple
                  options={
                    custodians?.map((c) => ({
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

export default CreateNetwork;
