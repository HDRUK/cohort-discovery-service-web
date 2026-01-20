"use client";
import ActionMenuSection, {
  ActionMenuSectionProps,
} from "@/components/ActionMenuSection";
import SwimLane from "@/components/SwimLane";
import { SwimLaneProps } from "@/components/SwimLane/SwimLane";
import SwimLaneContainer from "@/components/SwimLaneContainer";
import Title, { TitleProps } from "@/components/Title";
import CohortDiscoveryGuidanceMdx from "@/content/guidance/cohortDiscovery.mdx";
import { baseComponents } from "@/modules/Guidance/Guidance";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";
import { Divider, GridProps, IconButton, Paper, Skeleton } from "@mui/material";

const QueryBuilderGuidance = ({ onClose }: { onClose: () => void }) => {
  const components = {
    ...baseComponents,
    Title: (props: TitleProps) => <Title size="large" {...props} />,
    Close: () => (
      <IconButton sx={{ ml: "auto" }} onClick={onClose}>
        <CloseIcon />
      </IconButton>
    ),
    Divider: () => <Divider />,
    SwimLaneContainer: (props: GridProps) => (
      <SwimLaneContainer
        {...props}
        separatorNode={<ArrowForwardIcon color="secondary" />}
      />
    ),
    SwimLane: (props: SwimLaneProps) => (
      <SwimLane size={"grow"} paperSx={{ bgcolor: "white" }} {...props} />
    ),
    SectionTitle: (props: ActionMenuSectionProps) => (
      <ActionMenuSection fixedExpanded underline {...props} />
    ),
    Video: () => <Skeleton variant="rectangular" height={200} />,
  };

  return (
    <Paper sx={{ bgcolor: "white", p: 2, height: "100%" }}>
      <CohortDiscoveryGuidanceMdx components={components} />
    </Paper>
  );
};

export default QueryBuilderGuidance;
