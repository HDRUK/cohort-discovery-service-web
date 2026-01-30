import { Box, Stack, Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { CollectionHostFormValues } from "@/types/forms";
import { QueryContext } from "@/types/context";
import FormTextField from "@/components/FormTextField";
import FormDropdown from "@/components/FormDropdown";
import useCustodianStore from "@/hooks/useCustodianStore";

interface CollectionHostFormProps {
  custodianId: number;
  onCancel?: () => void;
  hideContext?: boolean;
}

const CreateCollectionHost = ({
  custodianId,
  onCancel,
  hideContext = true,
}: CollectionHostFormProps) => {
  const createCollectionHost = useCustodianStore(
    (st) => st.createCollectionHost,
  );

  const {
    handleSubmit,
    control,
    reset,
    formState: { isValid, isSubmitting },
  } = useForm<CollectionHostFormValues>({
    defaultValues: { name: "", context: QueryContext.BUNNY },
  });

  const onSubmit = async (data: CollectionHostFormValues) => {
    await createCollectionHost(custodianId, data);
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
      <Stack spacing={2} width={"70%"} height={"100%"}>
        <Controller
          name="name"
          control={control}
          rules={{ required: "Name is required" }}
          render={({ field, fieldState: { error } }) => (
            <FormTextField {...field} label="Name" error={error} fullWidth />
          )}
        />

        {hideContext ? (
          <Controller
            name="context"
            control={control}
            defaultValue={QueryContext.BUNNY}
            render={({ field }) => <input type="hidden" {...field} />}
          />
        ) : (
          <Controller
            name="context"
            control={control}
            rules={{ required: "Query context type is required" }}
            render={({ field, fieldState: { error } }) => (
              <FormDropdown
                {...field}
                options={Object.values(QueryContext).map((opt) => ({
                  label: opt,
                }))}
                select
                label="Query Context Type"
                error={error}
                fullWidth
              />
            )}
          />
        )}
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
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? "Creating..." : "Create"}
        </Button>
      </Stack>
    </Box>
  );
};

export default CreateCollectionHost;
