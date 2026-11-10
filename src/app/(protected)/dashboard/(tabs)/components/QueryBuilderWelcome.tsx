"use client";
import Title, { TitleProps } from "@/components/Title";
import CohortDiscoveryWelcomeMdx from "@/content/guidance/cohortDiscoveryWelcome.mdx";
import { baseComponents } from "@/modules/Guidance/Guidance";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Paper } from "@mui/material";

const QueryBuilderWelcome = ({ onClose }: { onClose: () => void }) => {
  const components = {
    ...baseComponents,
    Title: (props: TitleProps) => <Title size="large" {...props} />,
    Close: () => (
      <IconButton sx={{ ml: "auto" }} onClick={onClose}>
        <CloseIcon />
      </IconButton>
    ),
  };

  return (
    <Paper sx={{ bgcolor: "white", p: 2, height: "100%" }}>
      <CohortDiscoveryWelcomeMdx components={components} />
    </Paper>
  );
};

export default QueryBuilderWelcome;
