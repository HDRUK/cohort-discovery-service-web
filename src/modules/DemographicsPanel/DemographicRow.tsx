"use client";

import { ReactNode } from "react";
import { Box, Button, Divider, IconButton, Stack } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Title from "@/components/Title";
import DemographicSaveButton from "./DemographicSaveButton";

export interface DemographicRowActionProps {
  editing: boolean;
  disabled: boolean;
  hideActions: boolean;
  onEditStart: () => void;
  onSave: () => void;
  onReset: () => void;
  onClear: () => void;
}

interface DemographicRowProps extends DemographicRowActionProps {
  label: string;
  showClear?: boolean;
  children: ReactNode;
  renderEditing: ReactNode;
}

const DemographicRow = ({
  label,
  editing,
  disabled,
  hideActions,
  onEditStart,
  onSave,
  onReset,
  onClear,
  showClear = false,
  children,
  renderEditing,
}: DemographicRowProps) => {
  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        spacing={1}
        sx={{ py: 1, width: "100%" }}
      >
        <Title
          title={label}
          size={"small"}
          subTitle={editing ? " " : children}
          subTitleWrap={!editing}
          flexShrink={0}
          wrapperSx={{ width: "100%", alignItems: "flex-start" }}
        >
          {editing && (
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ width: "100%", pb: 1 }}>{renderEditing}</Box>

              {!hideActions && (
                <DemographicSaveButton onReset={onReset} onSave={onSave} />
              )}
            </Box>
          )}
        </Title>

        <Stack
          direction="row"
          alignItems="center"
          spacing={0.5}
          sx={{ minHeight: 32, flexShrink: 0 }}
        >
          {!editing && (
            <IconButton
              size="small"
              aria-label={`Edit ${label}`}
              disabled={disabled}
              onClick={onEditStart}
            >
              <EditOutlinedIcon
                fontSize="small"
                color={disabled ? "disabled" : "secondary"}
              />
            </IconButton>
          )}
          {showClear && !editing && (
            <Button
              variant="text"
              size="small"
              color="secondary"
              onClick={onClear}
            >
              Clear all
            </Button>
          )}
        </Stack>
      </Stack>
      <Divider />
    </>
  );
};

export default DemographicRow;
