import Paper from "@mui/material/Paper";
import { Box, Grid, GridProps } from "@mui/material";

interface SwimLaneProps extends GridProps {
  scrollable?: boolean;
  expandedSize?: number;
}

const SwimLane = ({
  children,
  scrollable = true,
  size,
  ...rest
}: SwimLaneProps) => {
  return (
    <Grid
      sx={(theme) => ({
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        height: "100%",
        transition: theme.transitions.create("all", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
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
          {children}
        </Box>
      </Paper>
    </Grid>
  );
};

export default SwimLane;
