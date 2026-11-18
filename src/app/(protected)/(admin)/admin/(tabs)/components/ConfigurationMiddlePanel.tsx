"use client";
import { ReactNode, Suspense } from "react";
import { CONFIGURATION_SECTION_PARAM } from "@/config/configuration";
import { useAdminAccessPolicy } from "@/contexts/AdminSectionContext";
import useSearchParams from "@/hooks/useSearchParams";
import { toConfigurationSection } from "@/lib/configurationSection";
import { ConfigurationSection } from "@/types/configuration";
import AccessPolicyPanel from "./AccessPolicyPanel";
import { DefaultsManager } from "./DefaultsManager";
import { FeatureFlagManager } from "./FeatureFlagManager";

const AdminAccessPolicyPanel = () => {
  const policy = useAdminAccessPolicy();
  return <AccessPolicyPanel policy={policy} />;
};

const SECTION_PANELS: Record<ConfigurationSection, ReactNode> = {
  [ConfigurationSection.Flags]: <FeatureFlagManager />,
  [ConfigurationSection.Defaults]: <DefaultsManager />,
  [ConfigurationSection.AccessControl]: (
    <Suspense fallback={<AccessPolicyPanel />}>
      <AdminAccessPolicyPanel />
    </Suspense>
  ),
};

const ConfigurationMiddlePanel = () => {
  const { getSearchParam } = useSearchParams(CONFIGURATION_SECTION_PARAM);
  return SECTION_PANELS[toConfigurationSection(getSearchParam())];
};

export default ConfigurationMiddlePanel;
