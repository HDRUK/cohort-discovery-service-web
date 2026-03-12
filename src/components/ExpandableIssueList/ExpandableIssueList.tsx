"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import List from "@/components/List";

type ExpandableIssueListProps = {
  title: string;
  items: string[];
  color?: "error" | "warning";
  defaultExpanded?: boolean;
  icon: React.ReactNode;
  helperText: string;
};

const ExpandableIssueList = ({
  title,
  items,
  color,
  defaultExpanded = false,
  icon,
  helperText,
}: ExpandableIssueListProps) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  if (items.length === 0) return null;

  return (
    <Accordion
      expanded={expanded}
      onChange={() => setExpanded((s) => !s)}
      disableGutters
      sx={{
        bgcolor: "background.default",
        boxShadow: "none",
        "&:before": { display: "none" },
      }}
    >
      <AccordionSummary
        sx={{
          px: 0,
          minHeight: "unset",
          "& .MuiAccordionSummary-content": { my: 1 },
        }}
      >
        <Stack direction="row" gap={1} alignItems="center">
          {icon}

          <Typography
            variant="body1"
            color={color ? `${color}.main` : undefined}
          >
            {items.length} {title}
          </Typography>

          <ExpandMoreIcon
            sx={{
              transition: "0.2s",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </Stack>
      </AccordionSummary>

      <AccordionDetails sx={{ px: 0, pt: 0, mx: 2 }}>
        <Stack gap={0}>
          <List
            bulleted
            items={items.map((item) => ({
              label: item,
            }))}
          />

          <Typography
            variant="body2"
            color={color ? `${color}.main` : undefined}
          >
            {helperText}
          </Typography>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default ExpandableIssueList;
