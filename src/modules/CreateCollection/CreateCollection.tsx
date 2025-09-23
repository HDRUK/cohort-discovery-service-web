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
import { useEffect, useState } from "react";
import { useDaphneStore } from "@/store/useDaphneStore";
import { CollectionHost, CreateCollectionPost, Custodian } from "@/types/api";
import { QueryContext } from "@/types/context";
import CollectionHostChip from "@/components/CollectionHostChip";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface CollectionFormProps {
  custodianPid: string;
  collectionHosts: CollectionHost[];
  onCancel?: () => void;
}

const schema = yup.object({
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
  type: yup
    .mixed<QueryContext>()
    .oneOf(
      Object.values(QueryContext) as QueryContext[],
      "Query context type is required"
    )
    .required("Query context type is required"),
  host_id: yup
    .number()
    .transform((value, original) => (original === "" ? undefined : value))
    .typeError("A collection host is required")
    .integer()
    .positive()
    .required("A collection host is required"),

  url: yup
    .string()
    .nullable()
    .transform((val) => (val === "" ? null : val))
    .when("type", {
      is: (val: QueryContext) => val === QueryContext.BEACON,
      then: (s) =>
        s
          .required("URL is required for Beacon")
          .matches(
            /^(https?:\/\/)([\w.-]+)(:\d+)?(\/.*)?$/,
            "Must be a valid URL"
          ),
      otherwise: (s) =>
        s
          .nullable()
          .notRequired()
          .transform(() => null),
    }),
});

type CollectionFormValues = yup.InferType<typeof schema>;

const CollectionForm = ({
  custodianPid,
  collectionHosts,
  onCancel,
}: CollectionFormProps) => {
  const {
    custodianData: { createCollection },
  } = useDaphneStore();

  const [submitting, setSubmitting] = useState(false);

  const { handleSubmit, control, reset, watch, setValue } =
    useForm<CollectionFormValues>({
      resolver: yupResolver(schema),
      defaultValues: {
        name: "",
        description: "",
        type: QueryContext.BUNNY,
        host_id: "" as unknown as number,
        url: "",
      },
    });

  const type = watch("type");

  useEffect(() => {
    if (type !== QueryContext.BEACON) {
      setValue("url", "", { shouldValidate: true, shouldDirty: true });
    }
  }, [type, setValue]);

  const onSubmit = async (data: CollectionFormValues) => {
    setSubmitting(true);
    await createCollection(custodianPid, data as CreateCollectionPost);
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
                {Object.values(QueryContext).map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    <Chip label={opt} size="small" color="secondary" />
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          {type === QueryContext.BEACON && (
            <Controller
              name="url"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="URL"
                  placeholder="https://example.com/endpoint"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                />
              )}
            />
          )}

          <Controller
            name="host_id"
            control={control}
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
                            disabled={true}
                          />
                        </Stack>
                      ),
                  },
                }}
              >
                {collectionHosts.map((ch) => (
                  <MenuItem key={ch.id} value={ch.id}>
                    <CollectionHostChip ch={ch} disabled />
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
