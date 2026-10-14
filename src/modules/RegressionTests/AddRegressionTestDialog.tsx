"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Stack,
  TextField,
  Autocomplete,
  IconButton,
  Tooltip,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import {
  CollectionWithHosts,
  RegressionTest,
  RegressionTestCollectionInput,
} from "@/types/api";
import { RuleGroupType } from "@/types/rules";
import Modal from "@/components/Modal";
import QueryDefinitionField from "@/components/QueryDefinitionField";
import { useChangedFieldValues } from "@/hooks/useChangedFieldValues";
import { useConfirm } from "@/hooks/useConfirm";

interface CollectionRow {
  collectionPid: string;
  expectedResult: number | null;
}

interface FormValues {
  name: string;
  collections: CollectionRow[];
}

interface AddRegressionTestDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: {
    name: string;
    query_definition: RuleGroupType;
    collections: RegressionTestCollectionInput[];
  }) => void;
  collections: CollectionWithHosts[];
  initial?: RegressionTest;
  initialJsonText?: string;
}

const AddRegressionTestDialog = ({
  open,
  onClose,
  onSubmit,
  collections,
  initial,
  initialJsonText = "",
}: AddRegressionTestDialogProps) => {
  const confirm = useConfirm();

  const [jsonText, setJsonText] = useState(initialJsonText);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [jsonPreview, setJsonPreview] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      collections: [{ collectionPid: "", expectedResult: null }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "collections",
  });

  const { hasChanges } = useChangedFieldValues({ control });

  useEffect(() => {
    if (open) {
      if (initial) {
        reset({
          name: initial.name,
          collections: initial.collections.map((c) => ({
            collectionPid: c.pid,
            expectedResult: c.expected_result,
          })),
        });
      } else {
        reset({
          name: "",
          collections: [{ collectionPid: "", expectedResult: null }],
        });
      }
    }
  }, [open, initial, reset]);

  const handleFormSubmit = useCallback(
    async (values: FormValues) => {
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
        collections: values.collections.map((c) => ({
          pid: c.collectionPid,
          expected_result: c.expectedResult,
        })),
      });
      onClose();
    },
    [onSubmit, onClose, jsonText],
  );

  const handleClose = useCallback(async () => {
    const isDirty = hasChanges || jsonText !== initialJsonText;
    if (!isDirty) {
      onClose();
      return;
    }
    const result = await confirm({
      title: "Unsaved changes",
      description: `Do you want to save your changes to "${initial?.name ?? "this test"}"?`,
      confirmText: "Save",
      tertiaryText: "Discard",
      cancelText: "Cancel",
      confirmColor: "primary",
      confirmVariant: "contained",
      tertiaryColor: "warning",
      tertiaryVariant: "outlined",
    });
    if (result === "confirm") {
      handleSubmit(handleFormSubmit)();
    } else if (result === "tertiary") {
      onClose();
    }
  }, [
    hasChanges,
    jsonText,
    initialJsonText,
    initial,
    confirm,
    onClose,
    handleSubmit,
    handleFormSubmit,
  ]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={initial ? "Edit Regression Test" : "Add Regression Test"}
      maxWidth="md"
      actionLabel="Cancel"
      additionalActions={
        <Button
          variant="outlined"
          onClick={() => handleSubmit(handleFormSubmit)()}
        >
          {initial ? "Save" : "Add"}
        </Button>
      }
    >
      <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
        <Stack spacing={2}>
          <TextField
            label="Name"
            fullWidth
            {...register("name", {
              required: "Required",
              minLength: { value: 3, message: "At least 3 characters" },
            })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <QueryDefinitionField
            value={jsonText}
            onChange={setJsonText}
            error={jsonError}
            onError={setJsonError}
            isPreview={jsonPreview}
            onPreviewChange={setJsonPreview}
          />

          <Divider />

          <Stack spacing={1}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body2" color="text.secondary">
                Collections
              </Typography>
              <Tooltip title="Add collection">
                <IconButton
                  size="small"
                  onClick={() =>
                    append({ collectionPid: "", expectedResult: null })
                  }
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>

            {fields.map((field, index) => (
              <Stack
                key={field.id}
                direction="row"
                spacing={1}
                alignItems="flex-start"
              >
                <Box sx={{ flex: 1 }}>
                  <Controller
                    name={`collections.${index}.collectionPid`}
                    control={control}
                    rules={{ required: "Required" }}
                    render={({ field: f }) => (
                      <Autocomplete
                        options={collections}
                        getOptionLabel={(c) => c.name}
                        getOptionKey={(c) => c.pid}
                        value={
                          collections.find((c) => c.pid === f.value) ?? null
                        }
                        onChange={(_, value) => f.onChange(value?.pid ?? "")}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Collection"
                            size="small"
                            error={!!errors.collections?.[index]?.collectionPid}
                            helperText={
                              errors.collections?.[index]?.collectionPid
                                ?.message
                            }
                          />
                        )}
                      />
                    )}
                  />
                </Box>

                <TextField
                  label="Expected"
                  type="number"
                  size="small"
                  sx={{ width: 120 }}
                  {...register(`collections.${index}.expectedResult`, {
                    setValueAs: (v: string) =>
                      v === "" || v == null ? null : Number(v),
                    min: { value: 0, message: "≥ 0" },
                  })}
                  error={!!errors.collections?.[index]?.expectedResult}
                  helperText={
                    errors.collections?.[index]?.expectedResult?.message
                  }
                />

                <Tooltip title="Remove">
                  <span>
                    <IconButton
                      size="small"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                      sx={{ mt: 0.5 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default AddRegressionTestDialog;
