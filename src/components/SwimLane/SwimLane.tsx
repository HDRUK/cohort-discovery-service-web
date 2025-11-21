import Paper from "@mui/material/Paper";
import { Box, Grid, GridProps } from "@mui/material";
import { useState, TransitionEvent } from "react";

export interface SwimLaneProps extends GridProps {
  scrollable?: boolean;
  hideOnTransiton?: boolean;
}

const SwimLane = ({
  children,
  scrollable = true,
  hideOnTransiton = false,
  size,
  ...rest
}: SwimLaneProps) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

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

  return (
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
          mx: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0,
            overflowY: scrollable ? "auto" : undefined,
          }}
        >
          {!isTransitioning && children}
        </Box>
      </Paper>
    </Grid>
  );
};

export default SwimLane;
