"use client";

import { useCallback, useState } from "react";
import { Alert, Box, Button, Stack, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import Modal from "@/components/Modal";
import QueryDefinitionField from "@/components/QueryDefinitionField";
import { RegressionTestCollectionInput } from "@/types/api";
import { RuleGroupType } from "@/types/rules";

interface FormValues {
  name: string;
  expectedResult: number | null;
}

interface AddHealthCheckDialogProps {
  open: boolean;
  onClose: () => void;
  collectionPids: string[];
  onSubmit: (values: {
    name: string;
    query_definition: RuleGroupType;
    collections: RegressionTestCollectionInput[];
  }) => void;
}

const AddHealthCheckDialog = ({
  open,
  onClose,
  collectionPids,
  onSubmit,
}: AddHealthCheckDialogProps) => {
  const [jsonText, setJsonText] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [jsonPreview, setJsonPreview] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { name: "", expectedResult: null },
  });

  const handleFormSubmit = useCallback(
    (values: FormValues) => {
      let parsed: RuleGroupType;
      try {
        parsed = JSON.parse(jsonText) as RuleGroupType;
      } catch {
        setJsonError("Invalid JSON");
        return;
      }

      onSubmit({
        name: values.name,
        query_definition: parsed,
        collections: collectionPids.map((pid) => ({
          pid,
          expected_result: values.expectedResult,
        })),
      });
      onClose();
    },
    [collectionPids, jsonText, onClose, onSubmit],
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add health check"
      maxWidth="md"
      actionLabel="Cancel"
      additionalActions={
        <Button
          variant="outlined"
          onClick={() => handleSubmit(handleFormSubmit)()}
        >
          Add
        </Button>
      }
    >
      <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
        <Stack spacing={2}>
          <Alert severity="info">
            This creates a regression test linked to all {collectionPids.length}{" "}
            collections and adds it as a new Stage 3 column. Set a
            per-collection expected count from the expanded row — a check with
            no expected count can never pass.
          </Alert>

          <TextField
            label="Name"
            fullWidth
            {...register("name", {
              required: "Required",
              minLength: { value: 3, message: "At least 3 characters" },
            })}
            error={!!errors.name}
            helperText={
              errors.name?.message ??
              "Used as the column header, so keep it short"
            }
          />

          <QueryDefinitionField
            value={jsonText}
            onChange={setJsonText}
            error={jsonError}
            onError={setJsonError}
            isPreview={jsonPreview}
            onPreviewChange={setJsonPreview}
          />

          <TextField
            label="Expected result for every collection"
            type="number"
            sx={{ width: 320 }}
            {...register("expectedResult", {
              setValueAs: (value: string) =>
                value === "" || value == null ? null : Number(value),
              min: { value: 0, message: "≥ 0" },
            })}
            error={!!errors.expectedResult}
            helperText={
              errors.expectedResult?.message ??
              "Optional — leave blank to set per collection later"
            }
          />
        </Stack>
      </Box>
    </Modal>
  );
};

export default AddHealthCheckDialog;
