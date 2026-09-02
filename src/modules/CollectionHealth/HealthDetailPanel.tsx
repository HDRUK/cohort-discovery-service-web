"use client";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {
  Box,
  Chip,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { CollectionHealthRow, HealthCheck, HealthStage } from "./health";
import ExpectedValue from "./ExpectedValue";
import { HealthIcon } from "./HealthIndicator";
import CollectionTelemetry from "./CollectionTelemetry";

const STAGE_LABELS: Record<HealthStage, string> = {
  1: "Stage 1 — Connectivity",
  2: "Stage 2 — Data returned",
  3: "Stage 3 — Validation",
};

interface HealthDetailPanelProps {
  row: CollectionHealthRow;
  isExpanded: boolean;
  isRunning: boolean;
  onUpdateExpected: (testPid: string, expected: number | null) => void;
  onRunTest: (testPid: string) => void;
}

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <Box sx={{ display: "flex", gap: 1 }}>
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ minWidth: 96, flexShrink: 0 }}
    >
      {label}
    </Typography>
    <Typography variant="caption" sx={{ wordBreak: "break-all" }}>
      {value}
    </Typography>
  </Box>
);

const CheckRow = ({
  check,
  isRunning,
  onUpdateExpected,
  onRunTest,
}: {
  check: HealthCheck;
  isRunning: boolean;
  onUpdateExpected: HealthDetailPanelProps["onUpdateExpected"];
  onRunTest: HealthDetailPanelProps["onRunTest"];
}) => (
  <Box sx={{ display: "flex", gap: 1 }}>
    <HealthIcon level={check.level} />
    <Box sx={{ minWidth: 0 }}>
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}
      >
        <Typography variant="body2" component="span">
          {check.label}
        </Typography>
        <Chip label={check.value} size="small" variant="outlined" />
        {check.stage === 3 && check.linked && check.testPid && (
          <>
            <ExpectedValue
              value={check.expected}
              onSave={(expected) =>
                onUpdateExpected(check.testPid as string, expected)
              }
            />
            <Tooltip title="Re-run just this health check on this collection">
              <span>
                <IconButton
                  size="small"
                  disabled={isRunning}
                  onClick={() => onRunTest(check.testPid as string)}
                >
                  <PlayArrowIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </>
        )}
      </Box>
      <Typography variant="caption" color="text.secondary" component="div">
        {check.detail}
      </Typography>
    </Box>
  </Box>
);

const HealthDetailPanel = ({
  row,
  isExpanded,
  isRunning,
  onUpdateExpected,
  onRunTest,
}: HealthDetailPanelProps) => (
  <Box sx={{ p: 2 }}>
    {/* Details are narrow and fixed; the plots take the rest of the width. */}
    <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap", mb: 2 }}>
      <Box sx={{ flexShrink: 0, minWidth: 380 }}>
        <Typography variant="subtitle2" gutterBottom>
          Collection
        </Typography>
        <Stack spacing={0.25}>
          <DetailRow label="PID" value={row.pid} />
          <DetailRow label="Custodian" value={row.custodianName} />
          <DetailRow label="State" value={row.stateSlug} />
          <DetailRow label="Context type" value={row.contextType} />
          <DetailRow label="URL" value={row.url ?? "—"} />
          <DetailRow label="Created" value={row.createdAt} />
          <DetailRow
            label="BUNNY version"
            value={row.bunnyVersion ?? "unknown"}
          />
          <DetailRow label="Synthetic" value={row.isSynthetic ? "Yes" : "No"} />
        </Stack>
      </Box>

      {/* MRT renders every row's panel, collapsed ones included, so the charts
          only mount once the row is actually open — one request per open row. */}
      <Box sx={{ flex: 1, minWidth: 420 }}>
        {isExpanded && <CollectionTelemetry collectionPid={row.pid} />}
      </Box>
    </Box>

    <Divider sx={{ mb: 2 }} />

    <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
      {([1, 2, 3] as HealthStage[]).map((stage) => (
        <Box key={stage} sx={{ minWidth: 320, flex: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            {STAGE_LABELS[stage]}
          </Typography>

          <Stack spacing={1}>
            {row.checks
              .filter((check) => check.stage === stage)
              .map((check) => (
                <CheckRow
                  key={check.id}
                  check={check}
                  isRunning={isRunning}
                  onUpdateExpected={onUpdateExpected}
                  onRunTest={onRunTest}
                />
              ))}

            {stage === 3 && !row.checks.some((check) => check.stage === 3) && (
              <Typography variant="caption" color="text.secondary">
                No health checks configured yet.
              </Typography>
            )}
          </Stack>
        </Box>
      ))}
    </Box>
  </Box>
);

export default HealthDetailPanel;
