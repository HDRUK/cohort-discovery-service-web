"use client";
import { ReactNode } from "react";
import SwimLane from "@/components/SwimLane";
import SwimLaneContainer from "@/components/SwimLaneContainer";
import { SwimLaneProps } from "@/components/SwimLane/SwimLane";

export enum ExpandedSide {
  LEFT = "left",
  RIGHT = "right",
}

type ThreePaneSwimLaneLayoutProps = {
  expandedSide?: ExpandedSide | null;
  rightDisabled?: boolean;
  panelWidth?: number;
  totalWidth?: number;
  left: ReactNode;
  leftProps?: SwimLaneProps;
  middle: ReactNode;
  middleProps?: SwimLaneProps;
  right: ReactNode;
  rightProps?: SwimLaneProps;
};

const getPanelSizes = (
  expanded: ExpandedSide | null,
  rightDisabled: boolean,
  panelWidth: number,
  totalWidth: number
) => {
  if (expanded === ExpandedSide.LEFT) {
    return {
      left: totalWidth - panelWidth,
      middle: 0,
      right: panelWidth,
    };
  }

  if (expanded === ExpandedSide.RIGHT) {
    return {
      left: 1,
      middle: rightDisabled ? totalWidth - panelWidth : 2 * panelWidth - 0.5,
      right: rightDisabled ? 0 : 2 * panelWidth - 0.5,
    };
  }

  return {
    left: panelWidth,
    middle: rightDisabled
      ? totalWidth - panelWidth
      : totalWidth - 2 * panelWidth,
    right: rightDisabled ? 0 : panelWidth,
  };
};

const ThreePaneSwimLaneLayout = ({
  expandedSide,
  rightDisabled = false,
  panelWidth = 2,
  totalWidth = 12,
  left,
  middle,
  right,
  leftProps,
  middleProps,
  rightProps,
}: ThreePaneSwimLaneLayoutProps) => {
  const {
    left: leftSize,
    middle: middleSize,
    right: rightSize,
  } = getPanelSizes(
    expandedSide ?? null,
    rightDisabled,
    panelWidth,
    totalWidth
  );

  return (
    <SwimLaneContainer>
      <SwimLane size={leftSize} paperSx={{ ml: 0 }} {...leftProps}>
        {left}
      </SwimLane>
      <SwimLane size={middleSize} paperSx={{ border: 1 }} {...middleProps}>
        {middle}
      </SwimLane>
      <SwimLane size={rightSize} paperSx={{ mr: 0 }} {...rightProps}>
        {right}
      </SwimLane>
    </SwimLaneContainer>
  );
};

export default ThreePaneSwimLaneLayout;
