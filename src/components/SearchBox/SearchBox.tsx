"use client";

import * as React from "react";
import { useState, useRef, useCallback } from "react";
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
  startIcon?: React.ReactNode;
  showEndIcon?: boolean;
  placeholders?: string[];
  placeholderOverride?: React.ReactNode;

  /**
   * Search action disabled:
   * - input can still be typed into
   * - Enter submit is blocked
   * - end icon is disabled
   */
  disabled?: boolean;

  /**
   * Input interaction disabled:
   * - cannot type
   * - cannot select text
   * - placeholderOverride can display
   */
  readOnly?: boolean;
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
  disabled = false,
  onClickEndAdornment,
  endIcon,
  startIcon,
  showEndIcon = true,
  placeholders,
  placeholderOverride,
  readOnly = false,
  onChange,
  onKeyDown,
  onMouseDown,
  onClick,
  ...rest
}: SearchBoxProps) => {
  const defaults = useDefaults();

  const [expanded, setExpanded] = useState(
    collapsible ? defaultExpanded : true,
  );

  const inputRef = useRef<HTMLInputElement | null>(null);

  const toggle = useCallback(() => {
    if (!collapsible) return;

    setExpanded((prev) => {
      const next = !prev;

      requestAnimationFrame(() => {
        if (next) inputRef.current?.focus();
        else inputRef.current?.blur();
      });

      return next;
    });
  }, [collapsible]);

  const searchActionDisabled = disabled || readOnly;

  const handleIconClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (searchActionDisabled) return;

      if (collapsible) toggle();
      onClickEndAdornment?.();
    },
    [searchActionDisabled, collapsible, toggle, onClickEndAdornment],
  );

  const actionChildren = React.Children.toArray(actions);
  const nActions = actionChildren.length;

  const STABLE_ID = "search-box";

  const rotatingPlaceholder = useRotatingPlaceholder(
    placeholders,
    defaults.searchSuggestionRotation,
  );

  const [internalValue, setInternalValue] = useState(rest.defaultValue ?? "");

  const inputValue = rest.value ?? internalValue;

  const isEmpty =
    inputValue === undefined ||
    inputValue === null ||
    String(inputValue).length === 0;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (readOnly) {
        e.preventDefault();
        return;
      }

      setInternalValue(e.target.value);
      onChange?.(e);
    },
    [readOnly, onChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (searchActionDisabled && e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      onKeyDown?.(e);
    },
    [searchActionDisabled, onKeyDown],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (readOnly) {
        e.preventDefault();
        return;
      }

      onMouseDown?.(e);
    },
    [readOnly, onMouseDown],
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (readOnly) {
        e.preventDefault();
        return;
      }

      onClick?.(e);
    },
    [readOnly, onClick],
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
        <Grid size="grow">
          <TextField
            {...rest}
            id={STABLE_ID}
            inputRef={inputRef}
            type="search"
            disabled={false}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onMouseDown={handleMouseDown}
            onClick={handleClick}
            sx={getTextFieldSx(
              collapsible,
              expanded,
              inputBgColor,
              warning,
              error,
            )}
            slotProps={{
              htmlInput: {
                sx: {
                  ...getHtmlInputSx(collapsible, expanded),

                  ...(readOnly
                    ? {
                        userSelect: "none",
                        pointerEvents: "none",
                        caretColor: "transparent",
                      }
                    : {}),
                },
                id: STABLE_ID,
                autoComplete: "off",
                name: "search-box",
                readOnly,
                tabIndex: readOnly ? -1 : rest.inputProps?.tabIndex,
              },
              input: {
                sx: {
                  bgcolor: inputBgColor,

                  "&.Mui-disabled": {
                    bgcolor: inputBgColor,
                  },

                  "& input[readonly]": {
                    bgcolor: inputBgColor,
                    cursor: "default",
                  },
                },
                startAdornment:
                  startIcon || (placeholderOverride && isEmpty) ? (
                    <InputAdornment position="start">
                      {startIcon}
                      {placeholderOverride && isEmpty
                        ? placeholderOverride
                        : null}
                    </InputAdornment>
                  ) : undefined,
                endAdornment: (
                  <InputAdornment position="end" sx={inputAdornmentSx}>
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : showEndIcon ? (
                      <IconButton
                        type="button"
                        disabled={searchActionDisabled}
                        onClick={handleIconClick}
                        aria-label={
                          collapsible
                            ? expanded
                              ? "Collapse search"
                              : "Expand search"
                            : "Submit search"
                        }
                        sx={iconButtonSx(searchActionDisabled)}
                      >
                        {endIcon ?? <SearchIcon fontSize="small" />}
                      </IconButton>
                    ) : null}
                  </InputAdornment>
                ),
              },
            }}
            {...(placeholderOverride === undefined && placeholders?.length
              ? { placeholder: rotatingPlaceholder }
              : {})}
          />
        </Grid>

        {nActions > 0 && (
          <Grid size="auto">{actionChildren.map((child) => child)}</Grid>
        )}
      </Grid>
    </Box>
  );
};

export default SearchBox;
