"use client";

import * as React from "react";
import { useState, useRef, ReactNode } from "react";
import {
  TextField,
  InputAdornment,
  Box,
  TextFieldProps,
  IconButton,
  CircularProgress,
  Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import {
  getContainerSx,
  getTextFieldSx,
  getHtmlInputSx,
  inputAdornmentSx,
  iconButtonSx,
} from "./SearchBox.styles";

export type SearchBoxProps = Omit<TextFieldProps, "onSubmit"> & {
  loading?: boolean;
  onSubmit?: () => void | Promise<void>;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  collapsedWidth?: number | string;
  expandedWidth?: number | string;
  inputBgColor?: string;
  actionIcon?: ReactNode;
  actions?: React.ReactNode[];
};

const SearchBox = ({
  onSubmit,
  loading = false,
  collapsible = true,
  defaultExpanded = true,
  collapsedWidth = 0,
  expandedWidth = "100%",
  inputBgColor = "#fff",
  actionIcon,
  actions,
  disabled,
  ...rest
}: SearchBoxProps) => {
  const [expanded, setExpanded] = useState(
    collapsible ? defaultExpanded : true
  );
  const inputRef = useRef<HTMLInputElement | null>(null);

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
    else void onSubmit?.();
  };

  const actionChildren = React.Children.toArray(actions);
  const nActions = actionChildren.length;
  const actionsCols = Math.min(2, nActions * 0.5);

  return (
    <Box
      sx={getContainerSx(collapsible, expanded, expandedWidth, collapsedWidth)}
      aria-expanded={expanded}
    >
      <Grid
        container
        gap={2}
        direction="row"
        columnSpacing={2}
        alignItems="center"
      >
        <Grid size={12 - actionsCols}>
          <TextField
            inputRef={inputRef}
            type="search"
            sx={getTextFieldSx(collapsible, expanded, inputBgColor)}
            slotProps={{
              htmlInput: {
                sx: getHtmlInputSx(collapsible, expanded),
              },
              input: {
                endAdornment: (
                  <InputAdornment position="end" sx={inputAdornmentSx}>
                    <IconButton
                      disabled={disabled}
                      onClick={handleIconClick}
                      aria-label={
                        collapsible
                          ? expanded
                            ? "Collapse search"
                            : "Expand search"
                          : "Submit search"
                      }
                      sx={iconButtonSx(disabled)}
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : actionIcon ? (
                        <>{actionIcon}</>
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
                  if (expanded) void onSubmit?.();
                  else toggle();
                } else {
                  void onSubmit?.();
                }
              }
            }}
            {...rest}
            disabled={disabled}
          />
        </Grid>
        {actionsCols > 0 && (
          <Grid size={actionsCols}>{actionChildren.map((child) => child)}</Grid>
        )}
      </Grid>
    </Box>
  );
};

export default SearchBox;
