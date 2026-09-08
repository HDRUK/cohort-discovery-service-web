"use client";

import { ReactNode, useState } from "react";
import {
  Box,
  Collapse,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";
import AccordionExpandIcon from "@/components/AccordionExpandIcon";

interface SectionCardProps {
  title?: string;
  action?: ReactNode;
  accentColour?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  summary?: ReactNode;
  children: ReactNode;
  sx?: SxProps<Theme>;
}

const SectionCard = ({
  title,
  action,
  accentColour,
  collapsible = false,
  defaultExpanded = true,
  summary,
  children,
  sx,
}: SectionCardProps) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const isOpen = !collapsible || expanded;

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        minWidth: 0,
        bgcolor: "background.paper",
        borderColor: "divider",
        ...(accentColour && {
          borderLeftWidth: 3,
          borderLeftColor: accentColour,
        }),
        ...sx,
      }}
    >
      {(title || action || collapsible) && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: isOpen ? 1 : 0, gap: 1 }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ minWidth: 0 }}
          >
            {title && (
              <Typography variant="subtitle2" noWrap>
                {title}
              </Typography>
            )}
            {!isOpen && summary && (
              <Typography variant="caption" color="text.secondary" noWrap>
                {summary}
              </Typography>
            )}
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            spacing={0.5}
            sx={{ flexShrink: 0 }}
          >
            {action}
            {collapsible && (
              <Tooltip title={expanded ? "Collapse" : "Expand"}>
                <IconButton
                  size="small"
                  aria-label={
                    expanded
                      ? `Collapse ${title ?? "section"}`
                      : `Expand ${title ?? "section"}`
                  }
                  aria-expanded={expanded}
                  onClick={() => setExpanded((previous) => !previous)}
                >
                  <AccordionExpandIcon expanded={expanded} />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Stack>
      )}

      {collapsible ? (
        <Collapse in={expanded}>{children}</Collapse>
      ) : (
        <Box>{children}</Box>
      )}
    </Paper>
  );
};

export default SectionCard;
