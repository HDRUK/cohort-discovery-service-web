"use client";

import { useMemo, useState } from "react";
import { FormProvider } from "react-hook-form";
import {
  Box,
  Button,
  Collapse,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccordionExpandIcon from "@/components/AccordionExpandIcon";
import { DemographicDomain } from "@/config/demographics";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import Title from "@/components/Title";
import DemographicAgeSection from "./DemographicAgeSection";
import DemographicCheckboxSection from "./DemographicCheckboxSection";
import DemographicLocationSection from "./DemographicLocationSection";
import useDemographicFieldEditing from "./useDemographicFieldEditing";
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
import { useQueryBuilderStore } from "@/store/queryBuilderStore";

const DemographicsPanel = ({
  initialExpand = true,
}: {
  initialExpand?: boolean;
}) => {
  const { demographics, setDemographics, remove, selectedDatasets } =
    useQueryBuilder((qb) => ({
      demographics: qb.queryBuilderJson.demographics,
      setDemographics: qb.setDemographics,
      remove: qb.removeDemographics,
      selectedDatasets: qb.selectedDatasets,
    }));
  const user = useUserDataStore((s) => s.user);
  const userCollections = useUserDataStore((s) => s.userCollections);
  const { queryBuilderUseLocation, queryBuilderUseRace, queryBuilderUseDeath } =
    useFeatures();

  const age = demographics?.age ?? null;
  const sex = demographics?.sex ?? [];
  const race = demographics?.race ?? [];
  const location = demographics?.location ?? null;
  const death = demographics?.death ?? null;

  const [expanded, setExpanded] = useState(initialExpand);

  const { form, allOpen, save, propsFor } = useDemographicFieldEditing(
    demographics,
    setDemographics,
  );

  const summary = [
    formatAgeSummary(age),
    formatConceptCountSummary("Sex", sex),
    ...(queryBuilderUseRace ? [formatConceptCountSummary("Race", race)] : []),
    ...(queryBuilderUseLocation ? [formatLocationSummary(location)] : []),
    // to do - add death
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

  const locationAvailable = useMemo(() => {
    const selected = new Set(selectedDatasets);
    return userCollections.some(
      (c) => selected.has(c.pid) && c.location_enabled,
    );
  }, [userCollections, selectedDatasets]);

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
        <FormProvider {...form}>
          <DemographicAgeSection {...propsFor("age")} />

          <DemographicCheckboxSection
            label="Sex"
            field="sex"
            options={sexConcepts ?? []}
            selected={sex}
            {...propsFor("sex")}
          />

          {queryBuilderUseRace && (
            <DemographicCheckboxSection
              label="Race"
              field="race"
              options={raceConcepts ?? []}
              selected={race}
              {...propsFor("race")}
            />
          )}

          {queryBuilderUseLocation && (
            <DemographicLocationSection
              locationAvailable={locationAvailable}
              {...propsFor("location")}
            />
          )}

          {/* {queryBuilderUseDeath && (
            <DemographicCheckboxSection
              label="Death"
              field="death"
              options={["dead", "alive", "unknown"]}
              selected={death}
              {...propsFor("death")}
            />
          )} */}

          {allOpen && (
            <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1 }}>
              <Button color="secondary" onClick={save}>
                Save Selection and Collapse
              </Button>
            </Stack>
          )}
        </FormProvider>
      </Collapse>
    </Box>
  );
};

export default DemographicsPanel;
