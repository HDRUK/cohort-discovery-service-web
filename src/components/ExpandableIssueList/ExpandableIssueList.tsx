"use client";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Typography,
} from "@mui/material";
import List from "@/components/List";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

type ExpandableIssueListProps = {
  title: string;
  items: string[];
  color?: "error" | "warning";
  icon: React.ReactNode;
  helperText?: string;
};

const ExpandableIssueList = ({
  title,
  items,
  color,
  icon,
  helperText,
}: ExpandableIssueListProps) => {
  if (items.length === 0) return null;

  return items.length === 1 ? (
    <Stack direction="row" gap={1} sx={{ my: 1 }}>
      {icon}
      {items.map((item) => (
        <Typography key={item} variant="body1">
          {item}
        </Typography>
      ))}
    </Stack>
  ) : (
    <Accordion
      disableGutters
      sx={{
        bgcolor: "inherit",
        boxShadow: "none",
        "&:before": { display: "none" },
      }}
    >
      <AccordionSummary
        expandIcon={<ArrowDropDownIcon />}
        sx={{
          px: 0,
          justifyContent: "flex-start",
          minHeight: "unset",
          "& .MuiAccordionSummary-content": {
            my: 1,
            flexGrow: 0,
          },
        }}
      >
        <Stack direction="row" gap={1} alignItems="center">
          {icon}

          <Typography variant="body1">
            {items.length} {title}
          </Typography>
        </Stack>
      </AccordionSummary>

      <AccordionDetails sx={{ px: 0, pt: 0, mx: 2 }}>
        <Stack gap={0}>
          <List
            bulleted
            items={items.map((item) => ({
              label: item,
              sx: { fontWeight: 1 },
            }))}
          />

          {helperText && (
            <Typography
              variant="body2"
              color={color ? `${color}.main` : undefined}
            >
              {helperText}
            </Typography>
          )}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default ExpandableIssueList;
