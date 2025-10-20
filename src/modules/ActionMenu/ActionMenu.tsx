"use client";

import * as React from "react";
import { useDaphneStore } from "@/store/useDaphneStore";
import {
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AccordionExpandIcon from "@/components/AccordionExpandIcon";

const ActionMenu: React.FC = () => {
  const {
    queryBuilder: { createNewGroup, createNewRule },
  } = useDaphneStore();

  return (
    <Accordion
      defaultExpanded
      disableGutters
      elevation={0}
      square
      sx={{
        bgcolor: "transparent",
        "&:before": { display: "none" },
      }}
    >
      <AccordionSummary
        expandIcon={<AccordionExpandIcon />}
        aria-controls="insert-section-content"
        id="insert-section-header"
        sx={{
          minHeight: 40,
          bgcolor: "transparent",
          "& .MuiAccordionSummary-content": { my: 0 },
        }}
      >
        <Typography variant="overline" color="text.secondary">
          Insert
        </Typography>
      </AccordionSummary>

      <AccordionDetails
        id="insert-section-content"
        sx={{
          p: 0,
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
        }}
      >
        <Button
          variant="text"
          startIcon={<AddIcon />}
          onClick={createNewRule}
          sx={{ justifyContent: "flex-start", color: "text.primary" }}
        >
          Add rule
        </Button>

        <Button
          variant="text"
          startIcon={<AddIcon />}
          onClick={createNewGroup}
          sx={{ justifyContent: "flex-start", color: "text.primary" }}
        >
          Add group
        </Button>
      </AccordionDetails>
    </Accordion>
  );
};

export default ActionMenu;
