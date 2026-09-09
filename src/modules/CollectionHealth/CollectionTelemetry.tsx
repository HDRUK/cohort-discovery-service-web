"use client";

import { Alert, Stack } from "@mui/material";
import SectionCard from "@/components/SectionCard";
import PingHistoryChart from "./PingHistoryChart";
import TaskHistoryChart from "./TaskHistoryChart";
import TelemetryRangeCard from "./TelemetryRangeCard";
import { TelemetryRange } from "./useTelemetryRange";

const DRAG_HINT =
  "Drag across any plot to narrow the range — every plot follows it.";

interface CollectionTelemetryProps {
  collectionPid: string;
  telemetry: TelemetryRange;
}

const CollectionTelemetry = ({
  collectionPid,
  telemetry,
}: CollectionTelemetryProps) => {
  const { bin, range, validationMessage, isQueryValid, handleSelectRange } =
    telemetry;

  return (
    <Stack spacing={2} sx={{ minWidth: 0 }}>
      <TelemetryRangeCard telemetry={telemetry} hint={DRAG_HINT} />

      {validationMessage && (
        <Alert severity="warning">{validationMessage}</Alert>
      )}

      <SectionCard title="Host polling">
        <PingHistoryChart
          collectionPid={collectionPid}
          bin={bin}
          range={range}
          enabled={isQueryValid}
          onSelectRange={handleSelectRange}
        />
      </SectionCard>

      <SectionCard title="Task activity">
        <TaskHistoryChart
          collectionPid={collectionPid}
          bin={bin}
          range={range}
          enabled={isQueryValid}
          onSelectRange={handleSelectRange}
        />
      </SectionCard>
    </Stack>
  );
};

export default CollectionTelemetry;
