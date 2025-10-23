"use client";

import { useState, useRef } from "react";
import {
  TextField,
  InputAdornment,
  Box,
  TextFieldProps,
  IconButton,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

type SearchBoxProps = Omit<TextFieldProps, "onSubmit"> & {
  loading?: boolean;
  onSubmit: () => void | Promise<void>;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  collapsedWidth?: number | string;
  expandedWidth?: number | string;
};

const SearchBox = ({
  onSubmit,
  loading = false,
  collapsible = true,
  defaultExpanded = true,
  collapsedWidth = 0,
  expandedWidth = "100%",
  ...rest
}: SearchBoxProps) => {
  const [expanded, setExpanded] = useState(
    collapsible ? defaultExpanded : true
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const toggle = () => {
    if (!collapsible) return;
    setExpanded((prev) => {
      const next = !prev;
      requestAnimationFrame(() => {
        if (next) inputRef.current?.focus();
        else inputRef.current?.blur();
      });
      return next;
    });
  };

  const handleIconClick = () => {
    if (collapsible) toggle();
    else void onSubmit();
  };

  return (
    <Box
      sx={(theme) => ({
        width: collapsible
          ? expanded
            ? expandedWidth
            : collapsedWidth
          : expandedWidth,
        transition: collapsible
          ? theme.transitions.create("width", {
              duration: 250,
              easing: theme.transitions.easing.easeInOut,
            })
          : "none",
      })}
      aria-expanded={expanded}
    >
      <TextField
        inputRef={inputRef}
        type="search"
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 100,
            boxShadow: "0px 2px 0px rgba(0, 0, 0, 0.23)",
            backgroundColor: "#fff",
            p: 0,
          },
          "& .MuiOutlinedInput-notchedOutline": {
            zIndex: 0,
            borderTop: "none",
            borderLeftColor: "rgba(0,0,0,0.1)",
            borderRightColor: "rgba(0,0,0,0.1)",
            borderBottomColor: "rgba(0,0,0,0.23)",
            opacity: collapsible ? (expanded ? 1 : 0) : 1,
            transition: collapsible ? "opacity 150ms" : "none",
            display: collapsible ? (expanded ? "none" : "inherit") : "inherit",
          },
          "& .MuiInputAdornment-root": { position: "relative", zIndex: 2 },
          "& .MuiFormLabel-root": {
            zIndex: 1,
          },
          "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline":
            {
              display: "inherit",
              opacity: 1,
              borderColor: (t) => t.palette.error.main,
            },

          "& .MuiOutlinedInput-root.Mui-error.Mui-disabled .MuiOutlinedInput-notchedOutline":
            {
              borderColor: (t) => t.palette.error.main,
            },
          "& .MuiInputLabel-root": {
            color: "text.secondary",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "text.secondary",
          },
          "& .MuiInputLabel-root.Mui-error": {
            color: (t) => t.palette.error.main,
          },
        }}
        slotProps={{
          htmlInput: {
            sx: {
              opacity: collapsible ? (expanded ? 1 : 0) : 1,
              transition: collapsible ? "opacity 150ms" : "none",
            },
          },
          input: {
            endAdornment: (
              <InputAdornment
                position="end"
                sx={{
                  position: "relative",
                  mr: -5,
                  zIndex: 3,
                }}
              >
                <IconButton
                  onClick={handleIconClick}
                  aria-label={
                    collapsible
                      ? expanded
                        ? "Collapse search"
                        : "Expand search"
                      : "Submit search"
                  }
                  sx={{
                    bgcolor: "grey.600",
                    boxShadow: "-4px 0px 6px -2px rgba(0, 0, 0, 0.4)",
                    color: "common.white",
                    borderRadius: "999px",
                    height: 60,
                    width: 60,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    lineHeight: 0,
                    "&:hover": { bgcolor: "grey.700" },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <SearchIcon fontSize="large" />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
            if (collapsible) {
              if (expanded) void onSubmit();
              else toggle();
            } else {
              void onSubmit();
            }
          }
        }}
        {...rest}
      />
    </Box>
  );
};

export default SearchBox;
