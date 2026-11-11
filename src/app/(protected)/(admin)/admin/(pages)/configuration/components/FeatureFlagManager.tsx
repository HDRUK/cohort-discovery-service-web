"use client";

import { useState } from "react";
import Table from "@/components/Table";
import { useTransposedTable } from "@/hooks/useTransposedTable";
import { useFeatureFlagsStore } from "@/store/featureFlagsStore";
import { Box, CircularProgress, Switch } from "@mui/material";

export const FeatureFlagManager = () => {
  const flags = useFeatureFlagsStore((s) => s.flags);
  const updateFlag = useFeatureFlagsStore((s) => s.updateFlag);
  const [savingKeys, setSavingKeys] = useState<string[]>([]);

  const handleToggleFeature = async (key: string, newValue: boolean) => {
    setSavingKeys((keys) => [...keys, key]);
    try {
      await updateFlag(key, newValue);
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
