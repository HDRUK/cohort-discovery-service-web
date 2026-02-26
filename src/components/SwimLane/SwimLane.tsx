import Paper, { PaperProps } from "@mui/material/Paper";
import { Box, Grid, GridProps, Portal, Backdrop } from "@mui/material";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  TransitionEvent,
} from "react";

type SwimLaneBlockerApi = {
  setBlocked: (blocked: boolean, onBackdropClick?: () => void) => void;
  blocked: boolean;
};

const SwimLaneBlockerContext = createContext<SwimLaneBlockerApi | null>(null);

export const useSwimLaneBlocker = () => {
  const ctx = useContext(SwimLaneBlockerContext);
  if (!ctx) {
    throw new Error("useSwimLaneBlocker must be used within <SwimLane />");
  }
  return ctx;
};

export interface SwimLaneProps extends GridProps {
  scrollable?: boolean;
  hideOnTransiton?: boolean;
  paperSx?: PaperProps["sx"];
  enableBlocker?: boolean;
}

const SwimLane = ({
  children,
  scrollable = true,
  hideOnTransiton = false,
  size,
  paperSx,
  enableBlocker = false,
  ...rest
}: SwimLaneProps) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [blocked, setBlockedState] = useState(false);
  const onBackdropClickRef = useRef<(() => void) | undefined>(undefined);

  const setBlocked = useCallback(
    (next: boolean, onBackdropClick?: () => void) => {
      setBlockedState(next);
      onBackdropClickRef.current = onBackdropClick;
    },
    [],
  );

  const blockerApi = useMemo<SwimLaneBlockerApi>(
    () => ({ blocked, setBlocked }),
    [blocked, setBlocked],
  );

  const handleTransitionStart = (e: TransitionEvent<HTMLDivElement>) => {
    if (
      e.nativeEvent.propertyName !== "width" &&
      e.nativeEvent.propertyName !== "flex-basis"
    )
      return;
    setIsTransitioning(true);
  };

  const handleTransitionEnd = (e: TransitionEvent<HTMLDivElement>) => {
    if (
      e.nativeEvent.propertyName !== "width" &&
      e.nativeEvent.propertyName !== "flex-basis"
    )
      return;
    setIsTransitioning(false);
  };

  const showBlocker = enableBlocker && blocked;

  return (
    <SwimLaneBlockerContext.Provider value={blockerApi}>
      {showBlocker && (
        <Portal>
          <Backdrop
            open
            onClick={() => onBackdropClickRef.current?.()}
            sx={(t) => ({
              zIndex: t.zIndex.drawer,
              bgcolor: "rgba(0,0,0,0.2)",
            })}
          />
        </Portal>
      )}

      <Grid
        onTransitionStart={hideOnTransiton ? handleTransitionStart : undefined}
        onTransitionEnd={hideOnTransiton ? handleTransitionEnd : undefined}
        sx={(theme) => ({
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          height: "100%",
          transition: theme.transitions.create(["width", "flex-basis"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.short,
          }),
          ...(scrollable && {
            overflowY: "auto",
            scrollbarGutter: "stable",
            scrollbarWidth: "thin",
            scrollbarColor: "transparent transparent",
            "&::-webkit-scrollbar": { width: 10 },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "transparent",
              borderRadius: 999,
            },
            "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
            "&:hover::-webkit-scrollbar-thumb, &:focus-within::-webkit-scrollbar-thumb":
              { backgroundColor: theme.palette.action.active },
            "&:hover::-webkit-scrollbar-track, &:focus-within::-webkit-scrollbar-track":
              { backgroundColor: theme.palette.action.hover },
            "&:hover, &:focus-within": {
              scrollbarColor: `${theme.palette.action.active} ${theme.palette.action.hover}`,
            },
          }),

          // elevate the whole lane above the backdrop when blocked
          position: "relative",
          zIndex: showBlocker ? theme.zIndex.drawer + 1 : "auto",
        })}
        {...rest}
        size={size}
      >
        <Paper
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0,
            p: 2,
            mr: 1,
            overflow: "auto",
            ...paperSx,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minHeight: 0,
              px: 0,
            }}
          >
            {!isTransitioning && children}
          </Box>
        </Paper>
      </Grid>
    </SwimLaneBlockerContext.Provider>
  );
};

export default SwimLane;
