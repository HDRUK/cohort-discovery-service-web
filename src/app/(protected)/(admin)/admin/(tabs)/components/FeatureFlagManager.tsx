"use client";

import { useCallback, useMemo, useState } from "react";
import { MRT_ColumnDef } from "material-react-table";
import { Box, CircularProgress, Paper, Switch } from "@mui/material";
import Table from "@/components/Table";
import { useTable } from "@/hooks/useTable";
import { useAdminFeatureOverrides } from "@/contexts/AdminSectionContext";
import updateFeatureFlag from "@/actions/admin/updateFeatureFlag";
import { useNotify } from "@/providers/NotifyProvider";
import { FeatureOverrides } from "@/types/features";
import { FeatureOverrideRules } from "./FeatureOverrideRules";

const overridesSummary = ({ users, workgroups }: FeatureOverrides) => {
  const count = users.length + workgroups.length;
  if (count === 0) return "—";
  return count === 1 ? "1 override" : `${count} overrides`;
};

const overridesKey = ({ users, workgroups }: FeatureOverrides) =>
  JSON.stringify([users, workgroups]);

export const FeatureFlagManager = () => {
  const features = useAdminFeatureOverrides();
  const [optimisticGlobals, setOptimisticGlobals] = useState<
    Record<string, boolean>
  >({});
  const [savingKeys, setSavingKeys] = useState<string[]>([]);
  const notify = useNotify();

  const handleToggleFeature = useCallback(
    async (key: string, newValue: boolean) => {
      setOptimisticGlobals((current) => ({ ...current, [key]: newValue }));
      setSavingKeys((keys) => [...keys, key]);
      try {
        await updateFeatureFlag(key, { enabled: newValue });
      } catch {
        setOptimisticGlobals((current) => {
          const reverted = { ...current };
          delete reverted[key];
          return reverted;
        });
        notify.error(
          `Could not save the "${key}" flag, so it has been switched back. Try again, or refresh the page if it keeps failing.`,
        );
      } finally {
        setSavingKeys((keys) => keys.filter((k) => k !== key));
      }
    },
    [notify],
  );

  const columns = useMemo<MRT_ColumnDef<FeatureOverrides>[]>(
    () => [
      {
        accessorKey: "feature",
        header: "Field",
      },
      {
        id: "global",
        header: "Value",
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
    data: features ?? [],
    enableRowSelection: false,
    enableExpanding: true,
    getRowId: ({ feature }) => feature,
    renderDetailPanel: ({ row }) => (
      <Paper
        variant="outlined"
        sx={{ p: 2 }}
        onClick={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <FeatureOverrideRules
          key={overridesKey(row.original)}
          feature={row.original}
        />
      </Paper>
    ),
  });

  return (
    <Table
      table={table}
      leftAction={{
        titleProps: {
          title: "Features",
          subTitle: "Flags",
        },
      }}
    />
  );
};
