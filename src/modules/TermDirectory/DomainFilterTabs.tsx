"use client";

import { Stack, Tab, Tabs, Typography } from "@mui/material";
import { DOMAIN_TABS } from "@/config/domainFilters";
import useSearchParams from "@/hooks/useSearchParams";
import { getDomainPhrase } from "@/utils/omop";
import { capitaliseFirstLetter } from "@/utils/string";
import DownloadButton from "@/components/DownloadButton";
import { AvailableFormats } from "@/components/DownloadButton/DownloadButton";

const DomainFilterTabs = () => {
  const { getSearchParam, setSearchParams } = useSearchParams("domain");

  const selected = getSearchParam() ?? "all";

  const setDomain = (value: string | null) =>
    setSearchParams({
      domain: value === "all" ? null : value,
      page: "1",
    });

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      gap={1}
      pt={1}
    >
      <Tabs
        value={selected}
        onChange={(_, value: string) => setDomain(value)}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="Filter terms by domain"
        sx={{ pt: 1 }}
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
      <DownloadButton
        formats={[AvailableFormats.CSV]}
        isIcon={false}
        isTermDirectory={true}
      />
    </Stack>
  );
};

export default DomainFilterTabs;
