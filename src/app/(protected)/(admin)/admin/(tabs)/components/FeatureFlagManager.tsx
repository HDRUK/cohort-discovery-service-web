"use client";

import { useCallback, useMemo, useState } from "react";
import { MRT_ColumnDef } from "material-react-table";
import {
  Box,
  CircularProgress,
  Paper,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import Table from "@/components/Table";
import { useTable } from "@/hooks/useTable";
import { useAdminFeatureOverrides } from "@/contexts/AdminSectionContext";
import updateFeatureFlag from "@/actions/admin/updateFeatureFlag";
import { useNotify } from "@/providers/NotifyProvider";
import {
  FEATURE_FLAG_GROUPS,
  FeatureFlagGroup,
  featureFlagDetails,
} from "@/config/featureFlags";
import { FeatureOverrides } from "@/types/features";
import { FeatureOverrideRules, OverrideRule } from "./FeatureOverrideRules";

const OVERRIDDEN_HELP =
  "Some workgroups or users have their own value for this flag. Changing the global value doesn't change theirs.";

const overrideCount = ({ users, workgroups }: FeatureOverrides) =>
  users.length + workgroups.length;

const overridesSummary = (feature: FeatureOverrides) => {
  if (!feature.overridable) return "Global only";
  const count = overrideCount(feature);
  if (count === 0) return "—";
  return count === 1 ? "1 override" : `${count} overrides`;
};

interface FeatureFlagTableProps {
  group: FeatureFlagGroup;
  features: FeatureOverrides[];
}

const FeatureFlagTable = ({ group, features }: FeatureFlagTableProps) => {
  const [optimisticGlobals, setOptimisticGlobals] = useState<
    Record<string, boolean>
  >({});
  const [savingKeys, setSavingKeys] = useState<string[]>([]);
  const [drafts, setDrafts] = useState<Record<string, OverrideRule[]>>({});
  const notify = useNotify();

  const handleToggleFeature = useCallback(
    async (key: string, newValue: boolean) => {
      setOptimisticGlobals((current) => ({ ...current, [key]: newValue }));
      setSavingKeys((keys) => [...keys, key]);
      try {
        await updateFeatureFlag(key, { enabled: newValue });
      } catch {
        notify.error(
          `Could not save the "${key}" flag, so it has been switched back. Try again, or refresh the page if it keeps failing.`,
        );
      } finally {
        setOptimisticGlobals((current) => {
          const settled = { ...current };
          delete settled[key];
          return settled;
        });
        setSavingKeys((keys) => keys.filter((k) => k !== key));
      }
    },
    [notify],
  );

  const setDraft = useCallback(
    (feature: string, draft: OverrideRule[] | undefined) =>
      setDrafts((current) => {
        const next = { ...current };
        if (draft) next[feature] = draft;
        else delete next[feature];
        return next;
      }),
    [],
  );

  const columns = useMemo<MRT_ColumnDef<FeatureOverrides>[]>(
    () => [
      {
        accessorKey: "feature",
        header: "Flag",
        Cell: ({ row }) => (
          <Stack>
            <Typography variant="body2">{row.original.feature}</Typography>
            <Typography variant="caption" color="text.secondary">
              {featureFlagDetails(row.original.feature).description}
            </Typography>
          </Stack>
        ),
      },
      {
        id: "global",
        header: "Global value",
        Cell: ({ row }) => {
          const { feature, global } = row.original;
          const isSaving = savingKeys.includes(feature);
          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Switch
                checked={optimisticGlobals[feature] ?? global}
                disabled={isSaving}
                slotProps={{
                  input: { "aria-label": `${feature} global value` },
                }}
                onChange={(event) =>
                  handleToggleFeature(feature, event.target.checked)
                }
              />
              {overrideCount(row.original) > 0 && (
                <Tooltip title={OVERRIDDEN_HELP} describeChild>
                  <WarningAmberIcon
                    color="warning"
                    fontSize="small"
                    titleAccess={`${feature} has overrides`}
                  />
                </Tooltip>
              )}
              <CircularProgress
                size={16}
                sx={{ visibility: isSaving ? "visible" : "hidden" }}
              />
            </Box>
          );
        },
      },
      {
        id: "overrides",
        header: "Overrides",
        Cell: ({ row }) => overridesSummary(row.original),
      },
    ],
    [optimisticGlobals, savingKeys, handleToggleFeature],
  );

  const table = useTable<FeatureOverrides>({
    columns,
    data: features,
    enableRowSelection: false,
    enableExpanding: true,
    getRowId: ({ feature }) => feature,
    renderDetailPanel: ({ row }) =>
      row.original.overridable ? (
        <Paper
          variant="outlined"
          sx={{ p: 2 }}
          onClick={(event) => event.stopPropagation()}
          onMouseDown={(event) => event.stopPropagation()}
        >
          <FeatureOverrideRules
            feature={row.original}
            draft={drafts[row.original.feature]}
            onDraftChange={(draft) => setDraft(row.original.feature, draft)}
          />
        </Paper>
      ) : null,
  });

  return (
    <Table
      table={table}
      leftAction={{
        titleProps: {
          title: group,
          subTitle: "Feature flags",
        },
      }}
    />
  );
};

export const FeatureFlagManager = () => {
  const features = useAdminFeatureOverrides();

  const groups = useMemo(
    () =>
      FEATURE_FLAG_GROUPS.map((group) => ({
        group,
        features: (features ?? []).filter(
          ({ feature }) => featureFlagDetails(feature).group === group,
        ),
      })).filter(({ features }) => features.length > 0),
    [features],
  );

  return (
    <Stack gap={3}>
      {groups.map(({ group, features }) => (
        <FeatureFlagTable key={group} group={group} features={features} />
      ))}
    </Stack>
  );
};
