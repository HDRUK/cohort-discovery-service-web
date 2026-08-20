"use client";

import { useMemo, useState } from "react";
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
import {
  DemographicConceptField,
  DemographicDomain,
} from "@/config/demographics";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import Title from "@/components/Title";
import DemographicAgeSection from "./DemographicAgeSection";
import DemographicCheckboxSection from "./DemographicCheckboxSection";
import DemographicLocationSection from "./DemographicLocationSection";
import {
  formatAgeSummary,
  formatConceptCountSummary,
  formatLocationSummary,
} from "./summary";
import { useQuery } from "@tanstack/react-query";
import getTermDirectory from "@/actions/termDirectory/getTermDirectory";
import { OmopTableName } from "@/types/omop";
import { useUserDataStore } from "@/hooks/userDataStore";
import useFeatures from "@/hooks/useFeatures";

const DemographicsPanel = ({
  initialExpand = true,
}: {
  initialExpand?: boolean;
}) => {
  const {
    demographics,
    remove,
    toggleConcept,
    setConcept,
    clearConcept,
    selectedDatasets,
  } = useQueryBuilder((qb) => ({
    demographics: qb.queryBuilderJson.demographics,
    remove: qb.removeDemographics,
    toggleConcept: qb.toggleDemographicsConcept,
    setConcept: qb.setDemographicsConcept,
    clearConcept: qb.clearDemographicsConcept,
    selectedDatasets: qb.selectedDatasets,
  }));
  const user = useUserDataStore((s) => s.user);
  const { queryBuilderUseLocation } = useFeatures();

  const age = demographics?.age ?? null;
  const sex = demographics?.sex ?? [];
  const race = demographics?.race ?? [];
  const location = demographics?.location ?? null;

  const [expanded, setExpanded] = useState(initialExpand);

  const summary = [
    formatAgeSummary(age),
    formatConceptCountSummary("Sex", sex),
    formatConceptCountSummary("Race", race),
    ...(queryBuilderUseLocation ? [formatLocationSummary(location)] : []),
  ].join(" · ");

  const collectionPids = [...selectedDatasets].sort();

  //this will be different for different users and what collectionPids are selected
  const { data: personConcepts } = useQuery({
    queryKey: [`demographics-${user?.id}`, collectionPids],
    queryFn: async () =>
      await getTermDirectory(1, 100, "", OmopTableName.Person, collectionPids),
    enabled: !!user?.id,
    staleTime: 10 * 60_000,
  });

  const sexConcepts = useMemo(
    () =>
      personConcepts?.data.data.filter(
        (c) => c.domain_id === DemographicDomain.Gender,
      ),
    [personConcepts],
  );

  const raceConcepts = useMemo(
    () =>
      personConcepts?.data.data.filter(
        (c) => c.domain_id === DemographicDomain.Race,
      ),
    [personConcepts],
  );

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
          options={sexConcepts ?? []}
          selected={sex}
          onToggle={(concept, selected) =>
            toggleConcept(DemographicConceptField.Sex, concept, selected)
          }
          onSetAll={(concepts) =>
            setConcept(DemographicConceptField.Sex, concepts)
          }
          onClear={() => clearConcept(DemographicConceptField.Sex)}
        />

        <DemographicCheckboxSection
          label="Race"
          options={raceConcepts ?? []}
          selected={race}
          onToggle={(concept, selected) =>
            toggleConcept(DemographicConceptField.Race, concept, selected)
          }
          onSetAll={(concepts) =>
            setConcept(DemographicConceptField.Race, concepts)
          }
          onClear={() => clearConcept(DemographicConceptField.Race)}
        />

        {queryBuilderUseLocation && <DemographicLocationSection />}
      </Collapse>
    </Box>
  );
};

export default DemographicsPanel;
