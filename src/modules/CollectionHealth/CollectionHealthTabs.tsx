"use client";

import TabsShell from "@/components/TabsShell";
import { routes } from "@/config/routes";

export const COLLECTION_HEALTH_TABS = {
  collections: "collections",
  telemetry: "telemetry",
} as const;

export type CollectionHealthTab =
  (typeof COLLECTION_HEALTH_TABS)[keyof typeof COLLECTION_HEALTH_TABS];

interface CollectionHealthTabsProps {
  value: CollectionHealthTab;
}

const CollectionHealthTabs = ({ value }: CollectionHealthTabsProps) => (
  <TabsShell
    forceValue
    value={value}
    tabs={[
      {
        id: COLLECTION_HEALTH_TABS.collections,
        label: "Collections",
        href: routes.adminCollectionHealth,
        page: null,
      },
      {
        id: COLLECTION_HEALTH_TABS.telemetry,
        label: "Telemetry",
        href: routes.adminCollectionHealthOverview,
        page: null,
      },
    ]}
    sx={{ height: "auto", flex: "0 0 auto", overflow: "visible" }}
  />
);

export default CollectionHealthTabs;
