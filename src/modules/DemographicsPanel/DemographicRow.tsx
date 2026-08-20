"use client";

import { ReactNode, useState } from "react";
import { Box, Button, Divider, IconButton, Stack } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Title from "@/components/Title";

interface DemographicRowProps {
  label: string;
  onEdit?: () => void;
  onSave?: () => void;
  onClear?: () => void;
  showClear?: boolean;
  children: ReactNode;
  renderEditing: ReactNode;
  // Render the editing content as a full-width block below the label row
  // instead of inline beside it — needed when the editor is wide (e.g. a
  // multi-column checkbox grid).
  fullWidthEditing?: boolean;
}

const DemographicRow = ({
  label,
  onEdit,
  onSave,
  onClear,
  showClear = false,
  children,
  renderEditing,
  fullWidthEditing = false,
}: DemographicRowProps) => {
  const [editing, setEditing] = useState(false);

  const handleEdit = () => {
    setEditing(true);
    onEdit?.();
  };

  const handleClear = () => {
    setEditing(false);
    onClear?.();
  };
  const handleSave = () => {
    setEditing(false);
    onSave?.();
  };

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="space-between"
        spacing={1}
        sx={{ py: 1, width: "100%" }}
      >
        <Title
          title={label}
          size={"small"}
          subTitle={
            editing ? (fullWidthEditing ? undefined : renderEditing) : children
          }
          wrapperSx={{ width: "100%" }}
        />

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
              onClick={handleEdit}
            >
              <EditOutlinedIcon fontSize="small" color="secondary" />
            </IconButton>
          )}
          {showClear && !editing && (
            <Button
              variant="text"
              size="small"
              color="secondary"
              onClick={handleClear}
            >
              Clear all
            </Button>
          )}
        </Stack>
      </Stack>
      <Divider />
      {editing && (
        <>
          {fullWidthEditing && (
            <Box sx={{ width: "100%", py: 1 }}>{renderEditing}</Box>
          )}
          <Stack
            direction={"row"}
            spacing={1}
            justifyContent={"flex-end"}
            my={1}
          >
            <Button variant="outlined" color="secondary" onClick={handleClear}>
              Reset Selection
            </Button>
            <Button color="secondary" onClick={handleSave}>
              Save Selection and Collapse
            </Button>
          </Stack>
          <Divider />
        </>
      )}
    </>
  );
};

export default DemographicRow;
