import { EditIcon } from "@/icons/EditIcon";
import {
  Box,
  TextField,
  Typography,
  type TextFieldProps,
  type TypographyProps,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";

export type EditableTextProps = {
  value: string;
  onCommit: (next: string) => void;
  typographyProps?: TypographyProps;
  textFieldProps?: Omit<TextFieldProps, "value" | "onChange">;
  commitOnBlur?: boolean;
  autoSelect?: boolean;
  trim?: boolean;
  placeholder?: string;
  showIcon?: boolean;
};

const EditableText = ({
  value,
  onCommit,
  typographyProps,
  textFieldProps,
  commitOnBlur = true,
  autoSelect = false,
  trim = true,
  placeholder,
  showIcon = false,
}: EditableTextProps) => {
  const [editing, setEditing] = useState(!value);
  const [hovering, setHovering] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const clickTimeoutRef = useRef<number | null>(null);
  const CLICK_DELAY = 250;

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      if (autoSelect) inputRef.current?.select();
    }
  }, [editing, autoSelect]);

  const stop = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const startEditing = (e: React.SyntheticEvent) => {
    stop(e);
    setDraft(value);
    setEditing(true);
  };

  const commit = () => {
    const next = trim ? draft.trim() : draft;
    if (!next) return;
    setEditing(false);
    if (next !== value) onCommit(next);
  };

  const cancel = () => {
    if (!value) return;
    setEditing(false);
    setDraft(value);
  };

  const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (clickTimeoutRef.current !== null) {
      window.clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      startEditing(e);
      return;
    }

    clickTimeoutRef.current = window.setTimeout(() => {
      clickTimeoutRef.current = null;
    }, CLICK_DELAY);
  };

  const displayText = value || placeholder || "";
  const STABLE_ID = "cohort-query-name";
  return (
    <Typography
      {...typographyProps}
      onClick={handleClick}
      onMouseOver={() => setHovering(true)}
      onMouseOut={() => setHovering(false)}
      sx={{
        ...(typographyProps?.sx || {}),
        ...(value
          ? {}
          : placeholder
            ? { opacity: 0.6, fontStyle: "italic" }
            : {}),
        cursor: editing ? "text" : "pointer",
      }}
    >
      {editing ? (
        <TextField
          id={STABLE_ID}
          autoFocus
          inputRef={inputRef}
          value={draft}
          onChange={(e) => {
            stop(e);
            setDraft(e.target.value);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit();
            } else if (e.key === "Escape") {
              e.preventDefault();
              cancel();
            }
          }}
          onBlur={commitOnBlur ? commit : cancel}
          {...textFieldProps}
          slotProps={{
            ...textFieldProps?.slotProps,
            htmlInput: {
              ...(textFieldProps?.slotProps?.htmlInput ?? {}),
              id: STABLE_ID,
            },
          }}
        />
      ) : (
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          gap={0.5}
          sx={{ mb: 0.5 }}
        >
          {displayText} {showIcon && hovering ? <EditIcon /> : null}
        </Box>
      )}
    </Typography>
  );
};

export default EditableText;
