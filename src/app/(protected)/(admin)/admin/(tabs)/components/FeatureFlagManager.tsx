"use client";

import { useState } from "react";
import Table from "@/components/Table";
import { useTransposedTable } from "@/hooks/useTransposedTable";
import { useAdminGlobalFeatureFlags } from "@/contexts/AdminSectionContext";
import updateFeatureFlag from "@/actions/admin/updateFeatureFlag";
import { useNotify } from "@/providers/NotifyProvider";
import { FeatureFlag, FeatureName } from "@/types/features";
import { Box, CircularProgress, Switch } from "@mui/material";

export const FeatureFlagManager = () => {
  const globalFlags = useAdminGlobalFeatureFlags();
  const [flags, setFlags] = useState<FeatureFlag | null>(globalFlags);
  const [savingKeys, setSavingKeys] = useState<string[]>([]);
  const notify = useNotify();

  const setFlag = (key: string, enabled: boolean) =>
    setFlags((current) => current && { ...current, [key]: enabled });

  const handleToggleFeature = async (key: string, newValue: boolean) => {
    const previous = flags?.[key as FeatureName];
    setFlag(key, newValue);
    setSavingKeys((keys) => [...keys, key]);
    try {
      await updateFeatureFlag(key, { enabled: newValue });
    } catch {
      if (previous !== undefined) setFlag(key, previous);
      notify.error(
        `Could not save the "${key}" flag, so it has been switched back. Try again, or refresh the page if it keeps failing.`,
      );
    } finally {
      setSavingKeys((keys) => keys.filter((k) => k !== key));
    }
  };

  const featuresTables = useTransposedTable({
    data: flags,
    valueFormatter: (value, key) => {
      const isSaving = savingKeys.includes(key);
      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Switch
            checked={value}
            disabled={isSaving}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              handleToggleFeature(key, event.target.checked);
            }}
          />
          <CircularProgress
            size={16}
            sx={{ visibility: isSaving ? "visible" : "hidden" }}
          />
        </Box>
      );
    },
  });
  return (
    <Table
      table={featuresTables}
      leftAction={{
        titleProps: {
          title: "Features",
          subTitle: "Flags",
        },
      }}
    />
  );
};
