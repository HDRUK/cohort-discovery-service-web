"use client";
import { Typography, IconButton, TextField } from "@mui/material";
import LockOutlineIcon from "@mui/icons-material/LockOutline";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ActionMenuSection from "@/components/ActionMenuSection";
import CopyableVariable from "@/components/CopyableVariable";
import { CollectionHost } from "@/types/api";
import { Control, Controller } from "react-hook-form";
import { maskClientTest } from "@/lib/maskClientTest";
import { CollectionHostGuidanceProps } from "./CollectionHostGuidance";

const CollectionHostGuidance = maskClientTest<CollectionHostGuidanceProps>(
  () => import("./CollectionHostGuidance")
);

type CollectionHostFormValues = { hostName: string };

type CollectionHostDetailPanelProps = {
  selectedCollectionHost: CollectionHost | null;
  expandedRight: boolean;
  expandedLeft: boolean;
  control: Control<CollectionHostFormValues>;
  handleEnter: () => void;
  handleLockClick: () => void;
  handleUnlockClick: () => void;
};

const CollectionHostDetailPanel = ({
  selectedCollectionHost,
  expandedRight,
  expandedLeft,
  control,
  handleEnter,
  handleLockClick,
  handleUnlockClick,
}: CollectionHostDetailPanelProps) => {
  if (!selectedCollectionHost) {
    return <CollectionHostGuidance creating={expandedLeft} />;
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
        Host
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
        title={"Host Name"}
        fixedExpanded
        defaultExpanded
        underline
      >
        {expandedRight ? (
          <Controller
            name="hostName"
            control={control}
            rules={{ required: "Host name is required" }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                slotProps={{ input: { sx: { borderRadius: 0 } } }}
                error={!!error}
                helperText={error?.message}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleEnter();
                  }
                }}
              />
            )}
          />
        ) : (
          selectedCollectionHost.name
        )}
      </ActionMenuSection>

      <ActionMenuSection
        title={"Host Credentials"}
        fixedExpanded
        defaultExpanded
        underline
      >
        Client ID
        <CopyableVariable value={selectedCollectionHost.client_id} />
        Client Secret
        <CopyableVariable hidden value={selectedCollectionHost.client_secret} />
      </ActionMenuSection>
    </>
  );
};

export default CollectionHostDetailPanel;
