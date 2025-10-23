"use client";

import * as React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  AccordionProps,
  Box,
} from "@mui/material";
import AccordionExpandIcon from "@/components/AccordionExpandIcon";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

interface ActionMenuSectionProps extends Omit<AccordionProps, "children"> {
  summary?: React.ReactNode;
  title?: string;
  underline?: boolean;
  attributes?: DraggableAttributes;
  listeners?: SyntheticListenerMap;
  disabled?: boolean;
  children?:
    | React.ReactNode
    | ((args: { expanded: boolean }) => React.ReactNode);
}

const ActionMenuSection = ({
  id,
  title,
  summary,
  children,
  underline = false,
  defaultExpanded = false,
  attributes,
  listeners,
  disabled,
  ...rest
}: ActionMenuSectionProps) => {
  const titleLowercase = (title ?? "").toLowerCase();
  const baseId = id ?? (titleLowercase || "section");

  const [expanded, setExpanded] = React.useState<boolean>(defaultExpanded);

  const handleChange = (event: React.SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setExpanded((prev) => !prev);
  };

  const renderChildren =
    typeof children === "function"
      ? (children as (args: { expanded: boolean }) => React.ReactNode)({
          expanded,
        })
      : children;

  return (
    <Accordion
      disableGutters
      elevation={0}
      expanded={expanded}
      square
      sx={{
        bgcolor: "transparent",
        "&:before": { display: "none" },
        width: "100%",
      }}
      {...rest}
    >
      <AccordionSummary
        {...attributes}
        {...listeners}
        disabled={disabled}
        expandIcon={
          <Box
            component="div"
            onClick={(e) => {
              e.stopPropagation();
              handleChange(e);
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <AccordionExpandIcon expanded={expanded} />
          </Box>
        }
        aria-controls={`${baseId}-content`}
        id={`${baseId}-header`}
        sx={{
          minHeight: 40,
          bgcolor: "transparent",
          "& .MuiAccordionSummary-content": { my: 0 },
          m: 0,
          p: 0,
        }}
      >
        {summary ?? (
          <Typography variant="overline" color="text.secondary">
            {title}
          </Typography>
        )}
      </AccordionSummary>

      <AccordionDetails
        id={`${baseId}-content`}
        sx={{
          p: 0,
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
          borderTop: underline ? 1 : 0,
          mx: underline ? 1 : 0,
        }}
      >
        {renderChildren}
      </AccordionDetails>
    </Accordion>
  );
};

export default ActionMenuSection;
