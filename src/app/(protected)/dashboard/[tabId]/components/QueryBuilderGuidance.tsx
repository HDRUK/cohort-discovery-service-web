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
import { HelpIcon } from "@/icons/HelpIcon";
import {
  Divider,
  GridProps,
  IconButton,
  Paper,
  Skeleton,
  Typography,
  TypographyProps,
} from "@mui/material";

const QueryBuilderGuidance = ({ onClose }: { onClose?: () => void }) => {
  const components = {
    ...baseComponents,
    Title: (props: TitleProps) => <Title size="medium" {...props} />,
    Close: () =>
      onClose ? (
        <IconButton sx={{ ml: "auto" }} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null,
    Divider: () => <Divider />,
    HelpIcon: () => (
      <HelpIcon
        sx={(theme) => ({
          color: theme.palette.tooltip?.main,
        })}
      />
    ),
    SwimLaneContainer: (props: GridProps) => (
      <SwimLaneContainer
        {...props}
        separatorNode={<ArrowForwardIcon color="inherit" sx={{ mt: 3 }} />}
      />
    ),
    SwimLaneContent: (props: TypographyProps) => (
      <Typography component={"div"} sx={{ pt: 1 }} {...props} />
    ),
    SwimLane: (props: SwimLaneProps) => (
      <SwimLane
        size={"grow"}
        paperSx={{ bgcolor: "white", px: 0, mx: 1 }}
        {...props}
      />
    ),
    SectionTitle: (props: ActionMenuSectionProps) => (
      <ActionMenuSection
        fixedExpanded
        underline
        accordionSummarySx={{ py: 1 }}
        {...props}
      />
    ),
    Video: () => <Skeleton variant="rectangular" height={200} />,
  };

  return (
    <Paper sx={{ bgcolor: "white", p: 2 }}>
      <CohortDiscoveryGuidanceMdx components={components} />
    </Paper>
  );
};

export default QueryBuilderGuidance;
