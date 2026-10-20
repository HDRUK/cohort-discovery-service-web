"use client";

import EditIcon from "@mui/icons-material/Edit";
import FormatIndentIncreaseIcon from "@mui/icons-material/FormatIndentIncrease";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, IconButton, Stack, TextField, Tooltip } from "@mui/material";
import CodeBlock from "@/components/CodeBlock";
import { tryParseJson } from "@/utils/helpers";

interface QueryDefinitionFieldProps {
  value: string;
  onChange: (value: string) => void;
  error: string | null;
  onError: (error: string | null) => void;
  isPreview: boolean;
  onPreviewChange: (isPreview: boolean) => void;
  label?: string;
  rows?: number;
  helperText?: string;
}

const QueryDefinitionField = ({
  value,
  onChange,
  error,
  onError,
  isPreview,
  onPreviewChange,
  label = "Query JSON",
  rows = 6,
  helperText = "Paste a valid query definition JSON object",
}: QueryDefinitionFieldProps) => {
  const parsed = tryParseJson(value);

  return (
    <Box sx={{ position: "relative" }}>
      {isPreview && parsed ? (
        <CodeBlock code={parsed} />
      ) : (
        <TextField
          label={label}
          multiline
          rows={rows}
          fullWidth
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
            onError(null);
            onPreviewChange(false);
          }}
          error={!!error}
          helperText={error ?? helperText}
          slotProps={{
            htmlInput: { style: { fontFamily: "monospace", fontSize: 12 } },
          }}
        />
      )}

      <Stack
        direction="row"
        spacing={0.5}
        sx={{ position: "absolute", top: 4, right: 4 }}
      >
        <Tooltip title="Format JSON">
          <span>
            <IconButton
              size="small"
              disabled={!value || isPreview}
              onClick={() => {
                try {
                  onChange(JSON.stringify(JSON.parse(value), null, 2));
                  onError(null);
                } catch {
                  onError("Invalid JSON");
                }
              }}
            >
              <FormatIndentIncreaseIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title={isPreview ? "Edit JSON" : "Preview JSON"}>
          <span>
            <IconButton
              size="small"
              disabled={!value || (!!error && !isPreview)}
              onClick={() => onPreviewChange(!isPreview)}
            >
              {isPreview ? (
                <EditIcon fontSize="small" />
              ) : (
                <VisibilityIcon fontSize="small" />
              )}
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
    </Box>
  );
};

export default QueryDefinitionField;
