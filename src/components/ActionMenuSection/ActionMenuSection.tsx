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
  fixedExpanded?: boolean;
  additionalAction?: React.ReactNode;
  scrollable?: boolean;
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
  fixedExpanded = false,
  additionalAction,
  attributes,
  listeners,
  disabled,
  scrollable = false,
  ...rest
}: ActionMenuSectionProps) => {
  const titleLowercase = (title ?? "").toLowerCase();
  const baseId = id ?? (titleLowercase || "section");

  const [expanded, setExpanded] = React.useState<boolean>(
    fixedExpanded ? true : defaultExpanded
  );

  const handleChange = (event: React.SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!fixedExpanded) {
      setExpanded((prev) => !prev);
    }
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
        ...(scrollable && {
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",

          "& .MuiAccordion-region, & .MuiCollapse-root, & .MuiCollapse-wrapper, & .MuiCollapse-wrapperInner":
            {
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
            },
        }),
      }}
      {...rest}
    >
      <AccordionSummary
        {...attributes}
        {...listeners}
        disabled={disabled}
        expandIcon={
          fixedExpanded ? undefined : (
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
          )
        }
        aria-controls={`${baseId}-content`}
        id={`${baseId}-header`}
        sx={{
          minHeight: 30,
          bgcolor: "transparent",
          "& .MuiAccordionSummary-content": { my: 0 },
          m: 0,
          p: 0,
          borderBottom: underline ? 1 : 0,
          my: 1,
        }}
      >
        {summary ?? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              alignContent: "space-between",
              width: "100%",
            }}
          >
            <Typography variant="overline" color="text.secondary">
              {title}
            </Typography>
            {additionalAction}
          </Box>
        )}
      </AccordionSummary>

      <AccordionDetails
        id={`${baseId}-content`}
        sx={{
          p: 0,
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
          ...(scrollable && {
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
          }),
        }}
      >
        {renderChildren}
      </AccordionDetails>
    </Accordion>
  );
};

export default ActionMenuSection;
