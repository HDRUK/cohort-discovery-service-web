"use client";
import { Box } from "@mui/material";
import ActionMenuSection from "@/components/ActionMenuSection";
import List from "@/components/List";
import {
  CONFIGURATION_SECTION_LABELS,
  CONFIGURATION_SECTION_PARAM,
} from "@/config/configuration";
import useSearchParams from "@/hooks/useSearchParams";
import { toConfigurationSection } from "@/lib/configurationSection";
import { ConfigurationSection } from "@/types/configuration";

const ConfigurationLeftPanel = () => {
  const { getSearchParam, setSearchParam } = useSearchParams(
    CONFIGURATION_SECTION_PARAM,
  );
  const selected = toConfigurationSection(getSearchParam());

  return (
    <Box
      sx={{
        px: 1,
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
      }}
    >
      <ActionMenuSection title="Settings" defaultExpanded underline>
        <List
          items={Object.values(ConfigurationSection).map((section) => ({
            id: section,
            label: CONFIGURATION_SECTION_LABELS[section],
            selected: section === selected,
            onClick: () => setSearchParam(section),
          }))}
        />
      </ActionMenuSection>
    </Box>
  );
};

export default ConfigurationLeftPanel;
