"use client";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ScienceIcon from "@mui/icons-material/Science";
import {
  Box,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import DetailRow from "@/components/DetailRow";
import SectionCard from "@/components/SectionCard";
import CollectionTelemetry from "./CollectionTelemetry";
import { CollectionHealthRow, HealthCheck, HealthStage } from "./health";
import ExpectedValue from "@/components/ExpectedValue";
import { HealthIcon } from "./HealthIndicator";

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

const FeatureChip = ({
  label,
  enabled,
  title,
}: {
  label: string;
  enabled: boolean;
  title: string;
}) => (
  <Tooltip title={title}>
    <Chip
      size="small"
      variant="outlined"
      color={enabled ? "success" : "default"}
      icon={
        enabled ? (
          <CheckIcon fontSize="small" />
        ) : (
          <CloseIcon fontSize="small" />
        )
      }
      label={label}
    />
  </Tooltip>
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
  <Box
    sx={{
      p: 2,
      bgcolor: "background.default",
      borderTop: 1,
      borderBottom: 1,
      borderColor: "divider",
      boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.07)",
    }}
  >
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
      <SectionCard
        title="Collection"
        sx={{ flexShrink: 0, width: 380, maxWidth: "100%" }}
      >
        <Stack spacing={0.25}>
          <DetailRow label="PID" value={row.pid} />
          <DetailRow label="Custodian" value={row.custodianName} />
          <DetailRow label="Context type" value={row.contextType} />
          <DetailRow label="URL" value={row.url ?? "—"} />
          <DetailRow label="Created" value={row.createdAt} />
          <DetailRow
            label="BUNNY version"
            value={row.bunnyVersion ?? "unknown"}
          />
        </Stack>

        <Stack
          direction="row"
          spacing={0.75}
          useFlexGap
          sx={{ flexWrap: "wrap", mt: 1.5 }}
        >
          <Chip size="small" variant="outlined" label={row.stateSlug} />
          <FeatureChip
            label="Location"
            enabled={row.locationEnabled}
            title={
              row.locationEnabled
                ? "Location-based rules can be queried against this collection"
                : "Location is disabled — location rules will not run here"
            }
          />
          <FeatureChip
            label="Death"
            enabled={row.deathEnabled}
            title={
              row.deathEnabled
                ? "Death data is available on this collection"
                : "Death data is disabled on this collection"
            }
          />
          {row.isSynthetic && (
            <Tooltip title="This collection has been marked as being synthetic data">
              <Chip
                size="small"
                variant="outlined"
                color="info"
                icon={<ScienceIcon fontSize="small" />}
                label="Synthetic"
              />
            </Tooltip>
          )}
        </Stack>
      </SectionCard>

      <Box sx={{ flex: 1, minWidth: 420 }}>
        {isExpanded && <CollectionTelemetry collectionPid={row.pid} />}
      </Box>
    </Box>

    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: 2,
      }}
    >
      {([1, 2, 3] as HealthStage[]).map((stage) => {
        const checks = row.checks.filter((check) => check.stage === stage);

        return (
          <SectionCard key={stage} title={STAGE_LABELS[stage]}>
            <Stack spacing={1}>
              {checks.map((check) => (
                <CheckRow
                  key={check.id}
                  check={check}
                  isRunning={isRunning}
                  onUpdateExpected={onUpdateExpected}
                  onRunTest={onRunTest}
                />
              ))}

              {stage === 3 && checks.length === 0 && (
                <Typography variant="caption" color="text.secondary">
                  No health checks configured yet.
                </Typography>
              )}
            </Stack>
          </SectionCard>
        );
      })}
    </Box>
  </Box>
);

export default HealthDetailPanel;
