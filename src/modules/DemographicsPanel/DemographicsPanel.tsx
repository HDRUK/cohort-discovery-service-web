"use client";

import { useState } from "react";
import {
  Box,
  Collapse,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccordionExpandIcon from "@/components/AccordionExpandIcon";
import { SEX_CONCEPTS, SEX_GUIDANCE } from "@/config/demographics";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import Title from "@/components/Title";
import DemographicAgeSection from "./DemographicAgeSection";
import DemographicCheckboxSection from "./DemographicCheckboxSection";
import { formatAgeSummary, formatConceptCountSummary } from "./summary";

const DemographicsPanel = () => {
  const { demographics, remove, toggleSex, clearSex } = useQueryBuilder(
    (qb) => ({
      demographics: qb.queryBuilderJson.demographics,
      remove: qb.removeDemographics,
      toggleSex: qb.toggleDemographicsSex,
      clearSex: qb.clearDemographicsSex,
    }),
  );

  const age = demographics?.age ?? null;
  const sex = demographics?.sex ?? [];

  const [expanded, setExpanded] = useState(false);

  const summary = [
    formatAgeSummary(age),
    formatConceptCountSummary("Sex", sex),
  ].join(" · ");

  return (
    <Box data-marquee-ignore="true">
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
      >
        <Stack
          direction="row"
          alignItems="baseline"
          spacing={1}
          sx={{ minWidth: 0 }}
        >
          <Title
            title={"Demographic Rule"}
            useSeparator={false}
            subTitle={
              !expanded && (
                <Typography variant="body1" color="text.secondary" noWrap>
                  {summary}
                </Typography>
              )
            }
          />
        </Stack>

        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Tooltip title={expanded ? "Collapse" : "Expand"}>
            <IconButton
              aria-label={
                expanded ? "Collapse demographics" : "Expand demographics"
              }
              onClick={() => setExpanded((prev) => !prev)}
            >
              <AccordionExpandIcon expanded={expanded} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Remove demographic rule">
            <IconButton aria-label="Remove demographic rule" onClick={remove}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <Collapse in={expanded}>
        <DemographicAgeSection />

        <DemographicCheckboxSection
          label="Sex"
          options={SEX_CONCEPTS}
          selected={sex}
          onToggle={toggleSex}
          onClear={clearSex}
          note={SEX_GUIDANCE}
        />
      </Collapse>
    </Box>
  );
};

export default DemographicsPanel;
