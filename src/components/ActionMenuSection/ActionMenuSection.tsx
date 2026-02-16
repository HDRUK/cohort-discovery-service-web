"use client";

import * as React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  AccordionProps,
  Box,
  BoxProps,
  Tooltip,
  IconButton,
} from "@mui/material";
import AccordionExpandIcon from "@/components/AccordionExpandIcon";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { useElementSize } from "@/hooks/useElementSize";
import { ActionMenuSectionContext } from "./ActionMenuSectionContext";

export interface ActionMenuSectionProps
  extends Omit<AccordionProps, "children" | "title"> {
  summary?: React.ReactNode;
  title?: React.ReactNode | string;
  shortTitle?: string | React.ReactNode;
  underline?: boolean;
  attributes?: DraggableAttributes;
  listeners?: SyntheticListenerMap;
  disabled?: boolean;
  fixedExpanded?: boolean;
  externalValue?: boolean;
  additionalAction?: React.ReactNode;
  scrollable?: boolean;
  collapseAt?: number;
  compact?: boolean;
  gap?: number;
  accordionSummarySx?: BoxProps["sx"];
  children?:
    | React.ReactNode
    | ((args: { expanded: boolean }) => React.ReactNode);
}

const ActionMenuSection = ({
  id,
  title,
  shortTitle,
  summary,
  children,
  underline = false,
  defaultExpanded = false,
  fixedExpanded = false,
  externalValue,
  additionalAction,
  attributes,
  listeners,
  disabled,
  accordionSummarySx,
  scrollable = false,
  collapseAt = 100,
  gap = 0.5,
  compact: compactProp,
  ...rest
}: ActionMenuSectionProps) => {
  const titleLowercase = typeof title === "string" ? title.toLowerCase() : "";
  const baseId = id ?? (titleLowercase || "section");

  const [ref, size] = useElementSize<HTMLDivElement>(baseId, {}, 10);
  const width = size.width as number;
  const compactMeasured = width > 0 && width < collapseAt;
  const compact = compactProp ?? compactMeasured;

  const [expanded, setExpanded] = React.useState<boolean>(
    fixedExpanded ? true : defaultExpanded,
  );

  React.useEffect(() => {
    if (fixedExpanded || externalValue === undefined) return;
    setExpanded(externalValue);
  }, [externalValue, fixedExpanded]);

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
    <ActionMenuSectionContext.Provider value={{ compact }}>
      <Accordion
        ref={ref}
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
            fixedExpanded || compact ? undefined : (
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
            borderBottom: !compact && underline ? 1 : 0,
            ...accordionSummarySx,
          }}
        >
          {summary ?? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: compact ? "center" : "space-between",
                width: "100%",
              }}
            >
              <>
                {compact && shortTitle ? (
                  <Tooltip title={title ?? ""}>
                    <Box
                      component="div"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <IconButton component="div" onClick={handleChange}>
                        {shortTitle}
                      </IconButton>
                    </Box>
                  </Tooltip>
                ) : (
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    sx={{ width: "100%" }}
                  >
                    {title}
                  </Typography>
                )}
                {additionalAction}
              </>
            </Box>
          )}
        </AccordionSummary>

        <AccordionDetails
          id={`${baseId}-content`}
          sx={{
            p: 0,
            display: "flex",
            flexDirection: "column",
            gap,
            ...(scrollable && {
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
            }),
          }}
        >
          {/*<Box component={"span"}>{size.width}</Box>*/}
          {renderChildren}
        </AccordionDetails>
      </Accordion>
    </ActionMenuSectionContext.Provider>
  );
};

export default ActionMenuSection;
