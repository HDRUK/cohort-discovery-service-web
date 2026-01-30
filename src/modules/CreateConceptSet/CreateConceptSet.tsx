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
import useUserStore from "@/store/useUserStore";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { OmopTableName } from "@/types/omop";

interface CreateConceptSetFormProps {
  onCancel?: () => void;
}

const schema = yup.object({
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
  domain: yup
    .mixed<OmopTableName>()
    .oneOf(
      Object.values(OmopTableName) as OmopTableName[],
      "OMOP domain is required",
    )
    .required("Query context type is required"),
});

type ConceptSetFormValues = yup.InferType<typeof schema>;

const CreateConceptSetForm = ({ onCancel }: CreateConceptSetFormProps) => {
  const createConceptSet = useUserStore((s) => s.createConceptSet);

  const [submitting, setSubmitting] = useState(false);

  const { handleSubmit, control, reset } = useForm<ConceptSetFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      domain: OmopTableName.Condition,
    },
  });

  const onSubmit = async (data: ConceptSetFormValues) => {
    setSubmitting(true);
    await createConceptSet(data);
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
            name="domain"
            control={control}
            rules={{ required: "Domain is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                select
                label="Domain"
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
                {Object.values(OmopTableName).map((opt) => (
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

const CreateConceptSet = () => {
  const [showForm, setShowForm] = useState(false);
  return (
    <>
      <IconButton disabled={showForm} onClick={() => setShowForm(true)}>
        <AddIcon />
        {" definition"}
      </IconButton>
      {showForm && <CreateConceptSetForm onCancel={() => setShowForm(false)} />}
    </>
  );
};

export default CreateConceptSet;
