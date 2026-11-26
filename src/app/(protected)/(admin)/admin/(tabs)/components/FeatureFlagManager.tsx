"use client";

import { useMemo } from "react";
import { MRT_ColumnDef } from "material-react-table";
import { Box, Paper, Stack, Tooltip, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import Table from "@/components/Table";
import { useTable } from "@/hooks/useTable";
import { useAdminFeatureOverrides } from "@/contexts/AdminSectionContext";
import {
  FEATURE_FLAG_GROUPS,
  FeatureFlagGroup,
  GLOBAL_ONLY_HELP,
  featureFlagDetails,
} from "@/config/featureFlags";
import { FeatureOverrides } from "@/types/features";
import { FeatureOverrideRules } from "./FeatureOverrideRules";
import GlobalValueSwitch from "./GlobalValueSwitch";
import { overrideCount, overriddenHelp } from "@/utils/overrideRules";

interface FeatureFlagTableProps {
  group: FeatureFlagGroup;
  features: FeatureOverrides[];
}

const FeatureFlagTable = ({ group, features }: FeatureFlagTableProps) => {
  const columns = useMemo<MRT_ColumnDef<FeatureOverrides>[]>(
    () => [
      {
        id: "global",
        header: "Global value",
        size: 130,
        grow: false,
        Cell: ({ row }) => (
          <GlobalValueSwitch
            feature={row.original.feature}
            global={row.original.global}
          />
        ),
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
    [],
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
