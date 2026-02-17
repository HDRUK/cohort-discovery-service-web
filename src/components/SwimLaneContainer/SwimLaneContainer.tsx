import { Grid, GridProps } from "@mui/material";
import React, { ReactNode } from "react";

export interface SwimLaneContainerProps extends GridProps {
  separatorNode?: ReactNode;
}

const SwimLaneContainer = ({
  children,
  separatorNode,
  ...props
}: SwimLaneContainerProps) => {
  const childrenArray = React.Children.toArray(children);

  return (
    <Grid
      container
      justifyContent="space-between"
      sx={{
        flex: 1,
        minHeight: 0,
        overflow: "hidden",
        //gap: 2, // ✅ consistent spacing
        //justifyContent: "flex-start", // ✅ no “mystery” space distribution
      }}
      {...props}
    >
      {childrenArray.map((child, index) => {
        const key = index;

        return <React.Fragment key={key}>{child}</React.Fragment>;
      })}
    </Grid>
  );
};

export default SwimLaneContainer;
