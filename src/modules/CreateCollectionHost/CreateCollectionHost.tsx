import {
  IconButton,
  TextField,
  Box,
  Stack,
  Button,
  MenuItem,
  Chip,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { useDaphneStore } from "@/store/useDaphneStore";
import { Custodian } from "@/types/api";

interface CollectionHostFormProps {
  custodianId: number;
  onCancel?: () => void;
}

interface CollectionHostFormValues {
  name: string;
  context: string;
}

const QUERY_CONTEXT_OPTIONS = ["BUNNY", "BEACON", "OTHER"];

const CollectionHostForm = ({
  custodianId,
  onCancel,
}: CollectionHostFormProps) => {
  const {
    custodianData: { createCollectionHost },
  } = useDaphneStore();

  const [submitting, setSubmitting] = useState(false);

  const { handleSubmit, control, reset } = useForm<CollectionHostFormValues>({
    defaultValues: { name: "", context: QUERY_CONTEXT_OPTIONS[0] },
  });

  const onSubmit = async (data: CollectionHostFormValues) => {
    setSubmitting(true);
    await createCollectionHost(custodianId, data);
    onCancel?.();
  };

  return (
    <Paper elevation={3} sx={{ width: "50%", mx: "auto", bgcolor: "white" }}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ mt: 2, p: 2 }}
      >
        <Stack spacing={2}>
          <Controller
            name="name"
            control={control}
            rules={{ required: "Name is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Name"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />

          <Controller
            name="context"
            control={control}
            rules={{ required: "Query context type is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                select
                label="Query Context Type"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
                slotProps={{
                  htmlInput: {
                    renderValue: (selected: string) => (
                      <Stack direction="row" spacing={1}>
                        <Chip label={selected} color="primary" size="small" />
                      </Stack>
                    ),
                  },
                }}
              >
                {QUERY_CONTEXT_OPTIONS.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    <Chip label={opt} size="small" color="secondary" />
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Stack direction="row" spacing={1}>
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? "Creating..." : "Create"}
            </Button>
            <Button
              type="button"
              onClick={() => {
                onCancel?.();
                reset();
              }}
              disabled={submitting}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
};

const CreateCollectionHost = ({ custodian }: { custodian: Custodian }) => {
  const [showForm, setShowForm] = useState(false);
  return (
    <>
      <IconButton disabled={showForm} onClick={() => setShowForm(true)}>
        <AddIcon />
        {" collection host"}
      </IconButton>
      {showForm && (
        <CollectionHostForm
          custodianId={custodian.id}
          onCancel={() => setShowForm(false)}
        />
      )}
    </>
  );
};

export default CreateCollectionHost;
