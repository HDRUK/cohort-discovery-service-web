"use client";

import { Box, Divider, Stack } from "@mui/material";
import QueryBuilder from "@/modules/QueryBuilder";
import CohortQueryInput from "@/components/CohortQueryInput";
import Title from "@/components/Title";
import CohortQueryPreview from "@/components/CohortQueryPreview";
import CohortQueryTitle from "@/components/CohortQueryTitle";
import FilterDatasets from "@/components/FilterDatasets";
import SelectDatasets from "@/components/SelectDatasets";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import { Query } from "@/types/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { QUERY_BUILDER_GUIDANCE_COOKIE } from "@/config/internals";
import GuidanceModal from "@/components/GuidanceModal";

interface CohortBuilderClientProps {
  initialShowGuidance: boolean;
  userQueries: Query[];
  query?: Query;
}

const CohortBuilderClient = ({
  initialShowGuidance,
  userQueries,
  query,
}: CohortBuilderClientProps) => {
  const open = useQueryBuilder((qb) => qb.openSelectDatasetsPanel);
  const [showGuidance, setShowGuidance] = useState(initialShowGuidance);
  const router = useRouter();

  const { setHelpTooltipOpen } = useQueryBuilder((qb) => ({
    setHelpTooltipOpen: qb.setHelpTooltipOpen,
  }));

  const handleCloseGuidance = () => {
    const maxAgeSeconds = 60 * 60 * 24 * 365;

    document.cookie = `${QUERY_BUILDER_GUIDANCE_COOKIE}=true; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax`;

    setShowGuidance(false);
    router.refresh();
    setHelpTooltipOpen(true, 10000);
  };

  return (
    <Box
      flex={1}
      minHeight={0}
      display="flex"
      flexDirection="column"
      px={2}
      py={1}
    >
      <GuidanceModal
        open={showGuidance}
        onClose={handleCloseGuidance}
        showHeader
      />

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
      >
        {open ? <Box /> : <CohortQueryTitle />}
        <FilterDatasets />
      </Stack>

      <SelectDatasets />

      {!open && (
        <>
          <Stack
            direction="row"
            alignItems="flex-start"
            spacing={2}
            display="flex"
          >
            <Stack direction="column" spacing={1} sx={{ flex: 1, minWidth: 0 }}>
              <CohortQueryInput queries={userQueries} />
              <Divider />
            </Stack>
          </Stack>

          <Title title="Query" subTitle="Preview" marginY={1}>
            <CohortQueryPreview />
          </Title>

          <QueryBuilder query={query} />
        </>
      )}
    </Box>
  );
};

export default CohortBuilderClient;
