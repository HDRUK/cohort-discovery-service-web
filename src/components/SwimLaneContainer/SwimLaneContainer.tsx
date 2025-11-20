import { Grid, GridProps } from "@mui/material";

const SwimLaneContainer = (props: GridProps) => (
  <Grid
    container
    justifyContent={"space-between"}
    sx={{
      flex: 1,
      minHeight: 0,
      overflow: "hidden",
    }}
    {...props}
  />
);

export default SwimLaneContainer;
