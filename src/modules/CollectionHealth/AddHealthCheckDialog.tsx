"use client";

import { useCallback, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import FormatIndentIncreaseIcon from "@mui/icons-material/FormatIndentIncrease";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Alert,
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { useForm } from "react-hook-form";
import CodeBlock from "@/components/CodeBlock";
import Modal from "@/components/Modal";
import { RegressionTestCollectionInput } from "@/types/api";
import { RuleGroupType } from "@/types/rules";
import { tryParseJson } from "@/utils/helpers";

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

  const parsedJson = tryParseJson(jsonText);

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
          onClick={() => handleSubmit(handleFormSubmit)()}>
          Add
        </Button>
      }>
      <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
        <Stack spacing={2}>
          <Alert severity="info">
            This creates a regression test linked to all {collectionPids.length}{" "}
            collections and adds it as a new Stage 3 column. Set a per-collection
            expected count from the expanded row — a check with no expected count
            can never pass.
          </Alert>

          <TextField
            label="Name"
            fullWidth
            helperText="Used as the column header, so keep it short"
            {...register("name", {
              required: "Required",
              minLength: { value: 3, message: "At least 3 characters" },
            })}
            error={!!errors.name}
          />

          <Box sx={{ position: "relative" }}>
            {jsonPreview && parsedJson ? (
              <CodeBlock code={parsedJson} />
            ) : (
              <TextField
                label="Query JSON"
                multiline
                rows={6}
                fullWidth
                value={jsonText}
                onChange={(event) => {
                  setJsonText(event.target.value);
                  setJsonError(null);
                  setJsonPreview(false);
                }}
                error={!!jsonError}
                helperText={
                  jsonError ?? "Paste a valid query definition JSON object"
                }
                slotProps={{
                  htmlInput: {
                    style: { fontFamily: "monospace", fontSize: 12 },
                  },
                }}
              />
            )}
            <Stack
              direction="row"
              spacing={0.5}
              sx={{ position: "absolute", top: 4, right: 4 }}>
              <Tooltip title="Format JSON">
                <span>
                  <IconButton
                    size="small"
                    disabled={!jsonText || jsonPreview}
                    onClick={() => {
                      try {
                        setJsonText(
                          JSON.stringify(JSON.parse(jsonText), null, 2),
                        );
                        setJsonError(null);
                      } catch {
                        setJsonError("Invalid JSON");
                      }
                    }}>
                    <FormatIndentIncreaseIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title={jsonPreview ? "Edit JSON" : "Preview"}>
                <span>
                  <IconButton
                    size="small"
                    disabled={!jsonText || (!!jsonError && !jsonPreview)}
                    onClick={() => setJsonPreview((preview) => !preview)}>
                    {jsonPreview ? (
                      <EditIcon fontSize="small" />
                    ) : (
                      <VisibilityIcon fontSize="small" />
                    )}
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
          </Box>

          <TextField
            label="Expected result for every collection"
            type="number"
            sx={{ width: 320 }}
            helperText="Optional — leave blank to set per collection later"
            {...register("expectedResult", {
              setValueAs: (value: string) =>
                value === "" || value == null ? null : Number(value),
              min: { value: 0, message: "≥ 0" },
            })}
            error={!!errors.expectedResult}
          />
        </Stack>
      </Box>
    </Modal>
  );
};

export default AddHealthCheckDialog;
