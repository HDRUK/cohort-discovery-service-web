"use client";

import { useState } from "react";
import {
  Box,
  Collapse,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccordionExpandIcon from "@/components/AccordionExpandIcon";
import { OmopTableName } from "@/types/omop";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import DemographicAgeSection from "./DemographicAgeSection";
import DemographicConceptSection from "./DemographicConceptSection";
import { formatAgeSummary, formatConceptCountSummary } from "./summary";

// Race is scaffolded in state and payload but not yet surfaced (DP-857 defers it).
const SHOW_RACE = false;

const DemographicsPanel = () => {
  const { demographics, remove, toggleSex, clearSex, toggleRace, clearRace } =
    useQueryBuilder((qb) => ({
      demographics: qb.queryBuilderJson.demographics,
      remove: qb.removeDemographics,
      toggleSex: qb.toggleDemographicsSex,
      clearSex: qb.clearDemographicsSex,
      toggleRace: qb.toggleDemographicsRace,
      clearRace: qb.clearDemographicsRace,
    }));

  const age = demographics?.age ?? null;
  const sex = demographics?.sex ?? [];
  const race = demographics?.race ?? [];
  const hasBeenConfigured = Boolean(age || sex.length || race.length);

  const [expanded, setExpanded] = useState(true);

  const summary = [
    formatAgeSummary(age),
    formatConceptCountSummary("Sex", sex),
    ...(SHOW_RACE ? [formatConceptCountSummary("Race", race)] : []),
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
          <Typography variant="overline" color="text.secondary">
            Demographic Rule
          </Typography>
          {!expanded && (
            <Typography variant="body2" color="text.secondary" noWrap>
              {summary}
            </Typography>
          )}
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
        <Divider sx={{ mb: 1 }} />

        {!hasBeenConfigured && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Set your demographic criteria below. Each category defaults to Any.
          </Typography>
        )}

        <DemographicAgeSection />

        <DemographicConceptSection
          label="Sex"
          domain={OmopTableName.Gender}
          concepts={sex}
          onToggle={toggleSex}
          onClear={clearSex}
        />

        {SHOW_RACE && (
          <DemographicConceptSection
            label="Race"
            domain={OmopTableName.Race}
            concepts={race}
            onToggle={toggleRace}
            onClear={clearRace}
          />
        )}
      </Collapse>
    </Box>
  );
};

export default DemographicsPanel;
