"use client";

import Table from "@/components/Table";
import { useTransposedTable } from "@/hooks/useTransposedTable";
import { useFeatureFlagsStore } from "@/store/featureFlagsStore";
import { Switch } from "@mui/material";

export const FeatureFlagManager = () => {
  const flags = useFeatureFlagsStore((s) => s.flags);
  const updateFlag = useFeatureFlagsStore((s) => s.updateFlag);

  const handleToggleFeature = async (key: string, newValue: boolean) => {
    await updateFlag(key, newValue);
  };

  const featuresTables = useTransposedTable({
    data: flags,
    valueFormatter: (value, key) => (
      <Switch
        checked={value}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          handleToggleFeature(key, event.target.checked);
        }}
      />
    ),
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
