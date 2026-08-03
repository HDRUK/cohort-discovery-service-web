"use client";

import { Tab, Tabs } from "@mui/material";
import { DOMAIN_TABS } from "@/config/domainFilters";
import useSearchParams from "@/hooks/useSearchParams";
import { getDomainPhrase } from "@/utils/omop";
import { capitaliseFirstLetter } from "@/utils/string";

const DomainFilterTabs = () => {
  const { getSearchParam, setSearchParams } = useSearchParams("domain");

  const selected = getSearchParam() ?? "all";

  const setDomain = (value: string | null) =>
    setSearchParams({
      domain: value === "all" ? null : value,
      page: "1",
    });

  return (
    <Tabs
      value={selected}
      onChange={(_, value: string) => setDomain(value)}
      variant="scrollable"
      scrollButtons="auto"
      aria-label="Filter terms by domain"
    >
      <Tab label="All" value="all" />
      {DOMAIN_TABS.map((domain) => (
        <Tab
          key={domain}
          label={capitaliseFirstLetter(getDomainPhrase(domain).noun)}
          value={domain}
        />
      ))}
    </Tabs>
  );
};

export default DomainFilterTabs;
