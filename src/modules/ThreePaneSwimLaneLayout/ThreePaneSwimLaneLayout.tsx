"use client";
import { ReactNode } from "react";
import SwimLane from "@/components/SwimLane";
import SwimLaneContainer from "@/components/SwimLaneContainer";

export enum ExpandedSide {
  LEFT = "left",
  RIGHT = "right",
}

type ThreePaneSwimLaneLayoutProps = {
  expandedSide: ExpandedSide | null;
  rightDisabled?: boolean;
  panelWidth?: number;
  totalWidth?: number;
  left: ReactNode;
  middle: ReactNode;
  right: ReactNode;
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
  panelWidth = 3,
  totalWidth = 12,
  left,
  middle,
  right,
}: ThreePaneSwimLaneLayoutProps) => {
  const {
    left: leftSize,
    middle: middleSize,
    right: rightSize,
  } = getPanelSizes(expandedSide, rightDisabled, panelWidth, totalWidth);

  return (
    <SwimLaneContainer>
      <SwimLane size={leftSize}>{left}</SwimLane>
      <SwimLane size={middleSize}>{middle}</SwimLane>
      <SwimLane size={rightSize}>{right}</SwimLane>
    </SwimLaneContainer>
  );
};

export default ThreePaneSwimLaneLayout;
