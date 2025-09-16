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
import { CollectionHost, Custodian } from "@/types/api";
import CollectionHostChip from "@/components/CollectionHostChip";

interface CollectionFormProps {
  custodianPid: string;
  collectionHosts: CollectionHost[];
  onCancel?: () => void;
}

interface CollectionFormValues {
  name: string;
  description: string;
  type: string;
  host_id: number;
}

const QUERY_CONTEXT_OPTIONS = ["bunny", "beacon"];

const CollectionForm = ({
  custodianPid,
  collectionHosts,
  onCancel,
}: CollectionFormProps) => {
  const {
    custodianData: { createCollection },
  } = useDaphneStore();

  const [submitting, setSubmitting] = useState(false);

  const { handleSubmit, control, reset } = useForm<CollectionFormValues>({
    defaultValues: {
      name: "",
      description: "",
      type: QUERY_CONTEXT_OPTIONS[0],
      host_id: 0,
    },
  });

  const onSubmit = async (data: CollectionFormValues) => {
    setSubmitting(true);
    await createCollection(custodianPid, data);
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
            name="description"
            control={control}
            rules={{ required: "Description is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Description"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />

          <Controller
            name="type"
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
                        <Chip label={selected} color="secondary" size="small" />
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

          <Controller
            name="host_id"
            control={control}
            rules={{ required: "A collection host is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                select
                label="Collection Host"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
                slotProps={{
                  htmlInput: {
                    renderValue: (selected: number) =>
                      selected > 0 && (
                        <Stack direction="row" spacing={1}>
                          <CollectionHostChip
                            ch={collectionHosts.find(
                              (ch) => ch.id === selected
                            )}
                          />
                        </Stack>
                      ),
                  },
                }}
              >
                {collectionHosts.map((ch) => (
                  <MenuItem key={ch.id} value={ch.id}>
                    <CollectionHostChip ch={ch} />
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

const CreateCollection = ({
  custodian,
  collectionHosts,
}: {
  custodian: Custodian;
  collectionHosts: CollectionHost[];
}) => {
  const [showForm, setShowForm] = useState(false);
  return (
    <>
      <IconButton disabled={showForm} onClick={() => setShowForm(true)}>
        <AddIcon />
        {" collection"}
      </IconButton>
      {showForm && (
        <CollectionForm
          custodianPid={custodian.pid}
          collectionHosts={collectionHosts}
          onCancel={() => setShowForm(false)}
        />
      )}
    </>
  );
};

export default CreateCollection;
