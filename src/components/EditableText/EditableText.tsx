import * as React from "react";
import {
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
};

const EditableText = ({
  value,
  onCommit,
  typographyProps,
  textFieldProps,
  commitOnBlur = false,
  autoSelect = false,
  trim = true,
  placeholder,
}: EditableTextProps) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editing) setDraft(value);
  }, [value, editing]);

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
    setEditing(false);
    if (next !== value) onCommit(next);
  };

  const cancel = () => {
    setEditing(false);
    setDraft(value);
  };

  return (
    <Typography
      {...typographyProps}
      onClick={stop}
      onDoubleClick={startEditing}
      sx={{
        ...(typographyProps?.sx || {}),
        ...(value
          ? {}
          : placeholder
          ? { opacity: 0.6, fontStyle: "italic" }
          : {}),
        cursor: editing ? "text" : undefined,
      }}
    >
      {editing ? (
        <TextField
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
        />
      ) : (
        <>{value || placeholder || ""}</>
      )}
    </Typography>
  );
};

export default EditableText;
