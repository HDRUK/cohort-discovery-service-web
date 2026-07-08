"use client";

import { Tab, Tabs } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { DOMAIN_TABS } from "@/config/domainFilters";

const DOMAIN_PARAM = "domain";
const PAGE_PARAM = "page";

const DomainFilterTabs = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selected = searchParams.get(DOMAIN_PARAM) ?? false;

  const setDomain = useCallback(
    (value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(DOMAIN_PARAM, value);
      } else {
        params.delete(DOMAIN_PARAM);
      }

      params.set(PAGE_PARAM, "1");

      router.replace(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <Tabs
      value={selected}
      onChange={(_, value: string) => setDomain(value)}
      variant="scrollable"
      scrollButtons="auto"
      aria-label="Filter terms by domain"
      sx={{
        "& .MuiTabs-indicator": {
          bgcolor: "#475DA7",
        },
      }}
    >
      {DOMAIN_TABS.map((domain) => (
        <Tab
          key={domain}
          label={domain}
          value={domain}
          sx={{
            "&.Mui-selected": {
              backgroundColor: "transparent",
            },
          }}
          onClick={() => {
            if (domain === selected) setDomain(null);
          }}
        />
      ))}
    </Tabs>
  );
};

export default DomainFilterTabs;
