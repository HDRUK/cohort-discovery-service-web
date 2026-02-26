import { Box, Typography } from "@mui/material";
import LockOutlineIcon from "@mui/icons-material/LockOutline";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import theme from "@/config/theme";
import { ReactNode } from "react";
import ActionMenuSection from "../ActionMenuSection";

type UpdatePanelProps = {
  label: string;
  expandedRight: boolean;
  onLockClick: () => void;
  onUnlockClick: () => void;
  children: ReactNode;
  rightExtras?: ReactNode;
};

export const UpdatePanel = ({
  label,
  expandedRight,
  onLockClick,
  onUnlockClick,
  children,
  rightExtras,
}: UpdatePanelProps) => {
  return (
    <ActionMenuSection
      title={
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography component="span" variant="overline">
            {label}
          </Typography>

          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1, ml: "auto" }}
          >
            {rightExtras}

            <Box
              sx={{
                ml: "auto",
                borderRadius: 1,
                p: 0.5,
                "&:hover": {
                  bgcolor: "grey.300",
                },
              }}
              onClick={() => {
                if (expandedRight) {
                  onLockClick();
                } else {
                  onUnlockClick();
                }
              }}
            >
              {expandedRight ? (
                <LockOpenIcon sx={{ color: theme.palette.tooltip?.main }} />
              ) : (
                <LockOutlineIcon />
              )}
            </Box>
          </Box>
        </Box>
      }
      fixedExpanded
      scrollable
    >
      {children}
    </ActionMenuSection>
  );
};
