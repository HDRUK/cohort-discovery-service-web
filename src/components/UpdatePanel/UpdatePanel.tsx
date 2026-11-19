"use client";

import { ReactNode, useCallback, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import theme from "@/config/theme";
import ActionMenuSection from "@/components/ActionMenuSection";
import CircularIconButton from "@/components/CircularIconButton";
import { useCloseGuard } from "@/providers/CloseGuardProvider";
import { useSwimLaneBlocker } from "@/components/SwimLane/SwimLane";
import { EditIcon } from "@/icons/EditIcon";
import { ToggleIcon } from "@/icons/ToggleIcon";

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
  const { setBlocked } = useSwimLaneBlocker();
  const { confirmCloseIfNeeded } = useCloseGuard();

  const handleClickaway = useCallback(async () => {
    const ok = await confirmCloseIfNeeded();
    if (!ok) return;
    onLockClick();
  }, [confirmCloseIfNeeded, onLockClick]);

  useEffect(() => {
    if (expandedRight) {
      setBlocked(true, () => {
        void handleClickaway();
      });
    } else {
      setBlocked(false);
    }

    return () => setBlocked(false);
  }, [expandedRight, setBlocked, handleClickaway]);

  const w = 128;
  const h = 30;
  const buttonToIconRatio = 0.6;
  const outlineWidth = 2;

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
                position: "relative",
                width: expandedRight ? w : "auto",
                height: expandedRight ? h : "auto",
              }}
            >
              {/* Background SVG */}
              {expandedRight ? (
                <ToggleIcon
                  sx={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    zIndex: 0,
                    objectFit: "contain",
                  }}
                />
              ) : null}

              {/* Foreground layer 1 */}
              <Box
                sx={{
                  position: "relative",
                  zIndex: 1,
                }}
                display="flex"
                flexDirection="row"
                justifyContent="flex-end"
              >
                {expandedRight ? (
                  <CircularIconButton
                    component="div"
                    disabled
                    sx={{
                      p: 1,
                      mt: 0,
                      ml: "auto",
                      mr: 0.5,
                      width: h,
                      height: h,
                    }}
                  >
                    <EditIcon
                      sx={{ color: "white", height: h * buttonToIconRatio }}
                    />
                  </CircularIconButton>
                ) : null}

                {/* Foreground layer 2 */}
                <CircularIconButton
                  data-testid={
                    expandedRight ? "save-panel-toggle" : "edit-panel-toggle"
                  }
                  component="div"
                  sx={{
                    borderRadius: 10,
                    p: 1,
                    mt: 0.1,
                    ml: 0.1,
                    mr: 2,
                    width: h - outlineWidth,
                    height: h - outlineWidth,
                    bgcolor: "white",
                    "&:hover": { bgcolor: "grey.300" },
                    outline: outlineWidth,
                    outlineColor: theme.palette.grey[500],
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
                    <SaveIcon
                      sx={{
                        color: theme.palette.tooltip?.main,
                        height: h * buttonToIconRatio,
                      }}
                    />
                  ) : (
                    <EditIcon
                      sx={{
                        color: theme.palette.tooltip?.main,
                        height: h * buttonToIconRatio,
                      }}
                    />
                  )}
                </CircularIconButton>
              </Box>
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
