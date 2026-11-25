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
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
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
import { FeatureOverrideRules } from "./FeatureOverrideRules";

const GLOBAL_ONLY_HELP = "Global only: this flag can't be overridden.";

const overrideCount = ({ users, workgroups }: FeatureOverrides) =>
  users.length + workgroups.length;

const overriddenHelp = (count: number) =>
  `${count === 1 ? "1 override" : `${count} overrides`}: some workgroups or users have their own value for this flag. Changing the global value doesn't change theirs.`;

interface OptimisticGlobal {
  value: boolean;
  serverValue: boolean;
}

const shownGlobal = (global: boolean, optimistic?: OptimisticGlobal) =>
  optimistic && optimistic.serverValue === global ? optimistic.value : global;

interface FeatureFlagTableProps {
  group: FeatureFlagGroup;
  features: FeatureOverrides[];
}

const FeatureFlagTable = ({ group, features }: FeatureFlagTableProps) => {
  const [optimisticGlobals, setOptimisticGlobals] = useState<
    Record<string, OptimisticGlobal>
  >({});
  const [savingKeys, setSavingKeys] = useState<string[]>([]);
  const notify = useNotify();

  const discardOptimisticGlobal = useCallback(
    (key: string) =>
      setOptimisticGlobals((current) => {
        const remaining = { ...current };
        delete remaining[key];
        return remaining;
      }),
    [],
  );

  const handleToggleFeature = useCallback(
    async (key: string, newValue: boolean, serverValue: boolean) => {
      setOptimisticGlobals((current) => ({
        ...current,
        [key]: { value: newValue, serverValue },
      }));
      setSavingKeys((keys) => [...keys, key]);
      try {
        await updateFeatureFlag(key, { enabled: newValue });
      } catch {
        discardOptimisticGlobal(key);
        notify.error(
          `Could not save the "${key}" flag, so it has been switched back. Try again, or refresh the page if it keeps failing.`,
        );
      } finally {
        setSavingKeys((keys) => keys.filter((k) => k !== key));
      }
    },
    [notify, discardOptimisticGlobal],
  );

  const columns = useMemo<MRT_ColumnDef<FeatureOverrides>[]>(
    () => [
      {
        id: "global",
        header: "Global value",
        size: 130,
        grow: false,
        Cell: ({ row }) => {
          const { feature, global } = row.original;
          const isSaving = savingKeys.includes(feature);
          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Switch
                checked={shownGlobal(global, optimisticGlobals[feature])}
                disabled={isSaving}
                slotProps={{
                  input: { "aria-label": `${feature} global value` },
                }}
                onChange={(event) =>
                  handleToggleFeature(feature, event.target.checked, global)
                }
              />
              <CircularProgress
                size={16}
                sx={{ visibility: isSaving ? "visible" : "hidden" }}
              />
            </Box>
          );
        },
      },
      {
        id: "status",
        header: "",
        size: 48,
        grow: false,
        Cell: ({ row }) => {
          const { feature } = row.original;
          if (!row.original.overridable) {
            return (
              <Tooltip title={GLOBAL_ONLY_HELP} describeChild>
                <LockOutlinedIcon
                  color="action"
                  fontSize="small"
                  titleAccess={`${feature} is global only`}
                />
              </Tooltip>
            );
          }
          const count = overrideCount(row.original);
          if (count === 0) return null;
          return (
            <Tooltip title={overriddenHelp(count)} describeChild>
              <WarningAmberIcon
                color="warning"
                fontSize="small"
                titleAccess={`${feature} has overrides`}
              />
            </Tooltip>
          );
        },
      },
      {
        accessorKey: "feature",
        header: "Flag",
        grow: true,
        Cell: ({ row }) => (
          <Stack>
            <Typography variant="body2">{row.original.feature}</Typography>
            <Typography variant="caption" color="text.secondary">
              {featureFlagDetails(row.original.feature).description}
            </Typography>
          </Stack>
        ),
      },
    ],
    [optimisticGlobals, savingKeys, handleToggleFeature],
  );

  const table = useTable<FeatureOverrides>({
    columns,
    data: features,
    enableRowSelection: false,
    enableExpanding: true,
    layoutMode: "grid",
    displayColumnDefOptions: {
      "mrt-row-actions": { visibleInShowHideMenu: false },
      "mrt-row-expand": { size: 48, grow: false },
    },
    getRowId: ({ feature }) => feature,
    renderDetailPanel: ({ row }) =>
      row.original.overridable ? (
        <Box
          sx={{
            p: 2,
            backgroundColor: "background.default",
            borderLeft: 4,
            borderColor: "divider",
            borderRadius: 1,
          }}
          onClick={(event) => event.stopPropagation()}
          onMouseDown={(event) => event.stopPropagation()}
        >
          <FeatureOverrideRules feature={row.original} />
        </Box>
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
        <Paper key={group} sx={{ p: 2 }}>
          <FeatureFlagTable group={group} features={features} />
        </Paper>
      ))}
    </Stack>
  );
};
