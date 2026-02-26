"use client";
import { ReactNode } from "react";
import SwimLane from "@/components/SwimLane";
import SwimLaneContainer from "@/components/SwimLaneContainer";
import { SwimLaneProps } from "@/components/SwimLane/SwimLane";
import { useThreePane } from "@/providers/ThreePaneProvider";

export enum ExpandedSide {
  LEFT = "left",
  RIGHT = "right",
}

type ThreePaneSwimLaneLayoutProps = {
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
  totalWidth: number,
) => {
  if (expanded === ExpandedSide.LEFT) {
    return {
      left: totalWidth - 2 * panelWidth,
      middle: 0,
      right: 2 * panelWidth,
    };
  }

  if (expanded === ExpandedSide.RIGHT) {
    const left = 0.5 * panelWidth;
    const right = rightDisabled ? panelWidth : (totalWidth - left) / 2;

    return {
      left,
      middle: totalWidth - right - left,
      right,
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
  const { expandedSide } = useThreePane();

  const {
    left: leftSize,
    middle: middleSize,
    right: rightSize,
  } = getPanelSizes(
    expandedSide ?? null,
    rightDisabled,
    panelWidth,
    totalWidth,
  );

  return (
    <SwimLaneContainer>
      <SwimLane size={leftSize} {...leftProps}>
        {left}
      </SwimLane>
      <SwimLane size={middleSize} {...middleProps}>
        {middle}
      </SwimLane>
      <SwimLane enableBlocker={true} size={rightSize} {...rightProps}>
        {right}
      </SwimLane>
    </SwimLaneContainer>
  );
};

export default ThreePaneSwimLaneLayout;
