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
      }}
      {...props}
    >
      {childrenArray.map((child, index) => {
        const key = index;

        return (
          <React.Fragment key={key}>
            {child}
            {index < childrenArray.length - 1 ? separatorNode : null}
          </React.Fragment>
        );
      })}
    </Grid>
  );
};

export default SwimLaneContainer;
