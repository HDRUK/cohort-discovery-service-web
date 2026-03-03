"use client";

import * as React from "react";
import { useState, useRef } from "react";
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
import useRotatingPlaceholder from "@/hooks/useRotatingPlaceholder";
import { useDefaults } from "@/providers/DefaultProvider";

export type SearchBoxProps = Omit<TextFieldProps, "errors"> & {
  loading?: boolean;
  warning?: boolean;
  error?: boolean;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  collapsedWidth?: number | string;
  expandedWidth?: number | string;
  inputBgColor?: string;
  actions?: React.ReactNode[];
  onClickEndAdornment?: () => void;
  endIcon?: React.ReactNode;
  showEndIcon?: boolean;
  placeholders?: string[];
};

const SearchBox = ({
  loading = false,
  warning = false,
  error = false,
  collapsible = true,
  defaultExpanded = true,
  collapsedWidth = 0,
  expandedWidth = "100%",
  inputBgColor = "#fff",
  actions,
  disabled,
  onClickEndAdornment,
  endIcon,
  showEndIcon = true,
  placeholders,
  ...rest
}: SearchBoxProps) => {
  const defaults = useDefaults();
  const [expanded, setExpanded] = useState(
    collapsible ? defaultExpanded : true,
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

  const handleIconClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (collapsible) toggle();
    onClickEndAdornment?.();
  };

  const actionChildren = React.Children.toArray(actions);
  const nActions = actionChildren.length;

  const STABLE_ID = "search-box";

  const rotatingPlaceholder = useRotatingPlaceholder(
    placeholders,
    defaults.searchSuggestionRotation,
  );

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
        <Grid size={"grow"}>
          <TextField
            id={STABLE_ID}
            inputRef={inputRef}
            type="search"
            sx={getTextFieldSx(
              collapsible,
              expanded,
              inputBgColor,
              warning,
              error,
            )}
            slotProps={{
              htmlInput: {
                sx: getHtmlInputSx(collapsible, expanded),
                id: STABLE_ID,
                autoComplete: "off",
                name: "search-box",
              },
              input: {
                endAdornment: (
                  <InputAdornment position="end" sx={inputAdornmentSx}>
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : showEndIcon ? (
                      <IconButton
                        type="button"
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
                        {endIcon ?? <SearchIcon fontSize="small" />}
                      </IconButton>
                    ) : null}
                  </InputAdornment>
                ),
              },
            }}
            {...(placeholders?.length
              ? { placeholder: rotatingPlaceholder }
              : {})}
            {...rest}
          />
        </Grid>
        {nActions > 0 && (
          <Grid size={"auto"}>{actionChildren.map((child) => child)}</Grid>
        )}
      </Grid>
    </Box>
  );
};

export default SearchBox;
