"use client";

import { EditIcon } from "@/icons/EditIcon";
import {
  Box,
  TextField,
  Typography,
  type TextFieldProps,
  type TypographyProps,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export type EditableTextProps = {
  defaultValue: string;
  onCommit: (next: string) => void;
  typographyProps?: TypographyProps;
  textFieldProps?: Omit<TextFieldProps, "value" | "onChange">;
  commitOnBlur?: boolean;
  autoSelect?: boolean;
  trim?: boolean;
  placeholder?: string;
  showIcon?: boolean;
  singleClick?: boolean;
  editing?: boolean;
};

type FormValues = {
  value: string;
};

const EditableText = ({
  defaultValue,
  onCommit,
  typographyProps,
  textFieldProps,
  commitOnBlur = true,
  autoSelect = false,
  trim = true,
  placeholder,
  showIcon = false,
  singleClick = false,
  editing: editingProp,
}: EditableTextProps) => {
  const [editing, setEditing] = useState(!defaultValue);
  const [hovering, setHovering] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const clickTimeoutRef = useRef<number | null>(null);
  const CLICK_DELAY = 250;

  const { control, handleSubmit, resetField } = useForm<FormValues>({
    defaultValues: {
      value: defaultValue,
    },
  });

  useEffect(() => {
    resetField("value", { defaultValue });
  }, [defaultValue, resetField]);

  useEffect(() => {
    if (editingProp !== undefined && editingProp !== editing) {
      setEditing(editingProp);
    }
  }, [editingProp, editing]);

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
    if (editingProp === undefined) {
      setEditing(true);
    }
  };

  const commit = ({ value }: FormValues) => {
    onCommit(trim ? value.trim() : value);
    if (value) {
      if (editingProp === undefined) {
        setEditing(false);
      }
    }
  };

  const cancel = () => {
    resetField("value", { defaultValue });
    if (editingProp === undefined) {
      setEditing(false);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (singleClick) {
      startEditing(e);
      return;
    }

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

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (commitOnBlur) {
      handleSubmit(commit)(e);
    } else {
      cancel();
    }
  };

  const displayText = defaultValue || placeholder || "";
  const STABLE_ID = "cohort-query-name";
  return (
    <Typography
      {...typographyProps}
      onClick={handleClick}
      onMouseOver={() => setHovering(true)}
      onMouseOut={() => setHovering(false)}
      sx={{
        ...(typographyProps?.sx || {}),
        ...(defaultValue
          ? {}
          : placeholder
            ? { opacity: 0.6, fontStyle: "italic" }
            : {}),
        cursor: editing ? "text" : "pointer",
      }}
    >
      {editing || !defaultValue ? (
        <Box component={"form"}>
          <Controller
            name="value"
            control={control}
            defaultValue=""
            rules={{
              validate: (v: string) => {
                const s = trim ? v.trim() : v;
                if (s === "") return true; // allow empty
                return (
                  s.length >= 3 || "Query name must be at least 3 characters"
                );
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                id={STABLE_ID}
                autoFocus
                inputRef={inputRef}
                {...field}
                error={!!error}
                helperText={error?.message}
                onPointerDown={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSubmit(commit)();
                  } else if (e.key === "Escape") {
                    e.preventDefault();
                    cancel();
                  }
                }}
                onBlur={handleBlur}
                {...textFieldProps}
                slotProps={{
                  ...textFieldProps?.slotProps,
                  htmlInput: {
                    ...(textFieldProps?.slotProps?.htmlInput ?? {}),
                    id: STABLE_ID,
                  },
                }}
              />
            )}
          />
        </Box>
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
