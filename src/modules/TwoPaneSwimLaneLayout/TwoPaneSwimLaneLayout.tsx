"use client";
import { ReactNode } from "react";
import SwimLane from "@/components/SwimLane";
import SwimLaneContainer from "@/components/SwimLaneContainer";
import { SwimLaneProps } from "@/components/SwimLane/SwimLane";

export enum ExpandedSide {
  LEFT = "left",
  RIGHT = "right",
}

type TwoPaneSwimLaneLayoutProps = {
  panelWidth?: number;
  totalWidth?: number;
  left: ReactNode;
  leftProps?: SwimLaneProps;
  right: ReactNode;
  rightProps?: SwimLaneProps;
};

const getPanelSizes = (
  right: boolean,
  panelWidth: number,
  totalWidth: number,
) => {
  if (right) {
    return {
      left: totalWidth - panelWidth,
      right: panelWidth,
    };
  }

  return {
    left: totalWidth,
    right: 0,
  };
};

const TwoPaneSwimLaneLayout = ({
  panelWidth = 2,
  totalWidth = 12,
  left,
  right,
  leftProps,
  rightProps,
}: TwoPaneSwimLaneLayoutProps) => {
  const { left: leftSize, right: rightSize } = getPanelSizes(
    !!right,
    panelWidth,
    totalWidth,
  );

  return (
    <SwimLaneContainer>
      <SwimLane size={leftSize} paperSx={{ ml: 0 }} {...leftProps}>
        {left}
      </SwimLane>
      {right && (
        <SwimLane size={rightSize} paperSx={{ mr: 0 }} {...rightProps}>
          {right}
        </SwimLane>
      )}
    </SwimLaneContainer>
  );
};

export default TwoPaneSwimLaneLayout;
