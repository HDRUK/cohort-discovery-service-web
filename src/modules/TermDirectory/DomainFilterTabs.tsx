"use client";

import { Tab, Tabs } from "@mui/material";
import { DOMAIN_TABS } from "@/config/domainFilters";
import useSearchParams from "@/hooks/useSearchParams";

const DomainFilterTabs = () => {
  const { getSearchParam, setSearchParams } = useSearchParams("domain");

  const selected = getSearchParam() ?? false;

  const setDomain = (value: string | null) =>
    setSearchParams({ domain: value, page: "1" });

  return (
    <Tabs
      value={selected}
      onChange={(_, value: string) => setDomain(value)}
      variant="scrollable"
      scrollButtons="auto"
      aria-label="Filter terms by domain"
    >
      {DOMAIN_TABS.map((domain) => (
        <Tab
          key={domain}
          label={domain}
          value={domain}
          onClick={() => {
            if (domain === selected) setDomain(null);
          }}
        />
      ))}
    </Tabs>
  );
};

export default DomainFilterTabs;
