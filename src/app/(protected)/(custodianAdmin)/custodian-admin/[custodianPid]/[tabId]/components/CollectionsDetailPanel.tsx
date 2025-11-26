"use client";
import { Typography, IconButton, Chip, Box } from "@mui/material";
import LockOutlineIcon from "@mui/icons-material/LockOutline";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ActionMenuSection from "@/components/ActionMenuSection";
import { Collection } from "@/types/api";
import { Control, Controller } from "react-hook-form";
import AddButton from "@/components/AddButton";
import { UpdateCollectionFormValues } from "@/types/forms";
import FormTextField from "@/components/FormTextField";

type CollectionsDetailPanelProps = {
  selectedCollection: Collection | null;
  expandedRight: boolean;
  expandedLeft: boolean;
  control: Control<UpdateCollectionFormValues>;
  handleEnter: () => void;
  handleLockClick: () => void;
  handleUnlockClick: () => void;
};

const CollectionsDetailPanel = ({
  selectedCollection,
  expandedRight,
  control,
  handleEnter,
  handleLockClick,
  handleUnlockClick,
}: CollectionsDetailPanelProps) => {
  if (!selectedCollection) {
    //to-do: implement in a new ticket
    return <b> Guidance</b>;
  }

  return (
    <>
      <Typography
        component="div"
        variant="overline"
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        Collection
        <IconButton
          size="small"
          sx={{ ml: "auto" }}
          onClick={() => {
            if (expandedRight) {
              handleLockClick();
            } else {
              handleUnlockClick();
            }
          }}
        >
          {expandedRight ? <LockOpenIcon /> : <LockOutlineIcon />}
        </IconButton>
      </Typography>

      <ActionMenuSection
        title={"Collection Status"}
        fixedExpanded
        defaultExpanded
        underline
      >
        {/* to-do: implement in a future ticket */}
        <AddButton
          disabled
          label={"Request to make active"}
          action={() => ({})}
        />
      </ActionMenuSection>

      <ActionMenuSection
        title={"Status Guidance"}
        fixedExpanded
        defaultExpanded
        underline
      >
        {/* to-do: implement in a future ticket */}
        Lorem ipsum dolor sit amet,nconsectetur adipiscing elit.
      </ActionMenuSection>

      <ActionMenuSection
        title={"Workgroup access"}
        fixedExpanded
        defaultExpanded
        underline
      >
        {/* to-do: implement in a future ticket */}
        <Box>
          <Chip color="secondary" label="Public" />
        </Box>
      </ActionMenuSection>

      <ActionMenuSection
        title={"Collection Info"}
        fixedExpanded
        defaultExpanded
        underline
      >
        <Controller
          name="name"
          control={control}
          rules={{ required: "A name is required" }}
          render={({ field, fieldState: { error } }) => (
            <FormTextField
              {...field}
              label="Name"
              error={error}
              fullWidth
              required
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          rules={{ required: "A description is required" }}
          render={({ field, fieldState: { error } }) => (
            <FormTextField
              {...field}
              label="Description"
              error={error}
              fullWidth
              required
            />
          )}
        />

        <Controller
          disabled={!expandedRight}
          name="url"
          control={control}
          rules={{ required: "URL is required" }}
          render={({ field, fieldState: { error } }) => (
            <FormTextField
              copyable
              {...field}
              label="Link to Associated Dataset"
              error={error}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleEnter();
                }
              }}
            />
          )}
        />
      </ActionMenuSection>

      <ActionMenuSection
        title={"Collection Configuration"}
        fixedExpanded
        defaultExpanded
        underline
      >
        {/* to be implemented in a future ticket */}
      </ActionMenuSection>
    </>
  );
};

export default CollectionsDetailPanel;
