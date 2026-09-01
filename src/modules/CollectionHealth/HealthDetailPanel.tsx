"use client";

import { Box, Chip, Divider, Stack, Typography } from "@mui/material";
import { CollectionHealthRow, HealthCheck, HealthStage } from "./health";
import ExpectedValue from "./ExpectedValue";
import { HealthIcon } from "./HealthIndicator";

const STAGE_LABELS: Record<HealthStage, string> = {
  1: "Stage 1 — Connectivity",
  2: "Stage 2 — Data returned",
  3: "Stage 3 — Validation",
};

interface HealthDetailPanelProps {
  row: CollectionHealthRow;
  onUpdateExpected: (testPid: string, expected: number | null) => void;
}

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <Box sx={{ display: "flex", gap: 1 }}>
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ minWidth: 96, flexShrink: 0 }}>
      {label}
    </Typography>
    <Typography variant="caption" sx={{ wordBreak: "break-all" }}>
      {value}
    </Typography>
  </Box>
);

const CheckRow = ({
  check,
  onUpdateExpected,
}: {
  check: HealthCheck;
  onUpdateExpected: HealthDetailPanelProps["onUpdateExpected"];
}) => (
  <Box sx={{ display: "flex", gap: 1 }}>
    <HealthIcon level={check.level} />
    <Box sx={{ minWidth: 0 }}>
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
        <Typography variant="body2" component="span">
          {check.label}
        </Typography>
        <Chip label={check.value} size="small" variant="outlined" />
        {check.stage === 3 && check.linked && check.testPid && (
          <ExpectedValue
            value={check.expected}
            onSave={(expected) =>
              onUpdateExpected(check.testPid as string, expected)
            }
          />
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
  onUpdateExpected,
}: HealthDetailPanelProps) => (
  <Box sx={{ p: 2 }}>
    <Typography variant="subtitle2" gutterBottom>
      Collection
    </Typography>
    <Stack spacing={0.25} sx={{ mb: 2 }}>
      <DetailRow label="PID" value={row.pid} />
      <DetailRow label="Custodian" value={row.custodianName} />
      <DetailRow label="State" value={row.stateSlug} />
      <DetailRow label="Context type" value={row.contextType} />
      <DetailRow label="URL" value={row.url ?? "—"} />
      <DetailRow label="Created" value={row.createdAt} />
      <DetailRow label="BUNNY version" value={row.bunnyVersion ?? "unknown"} />
      <DetailRow label="Synthetic" value={row.isSynthetic ? "Yes" : "No"} />
    </Stack>

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
                  onUpdateExpected={onUpdateExpected}
                />
              ))}

            {stage === 3 &&
              !row.checks.some((check) => check.stage === 3) && (
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
