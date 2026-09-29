import { DOMAIN_TAB_FILTERS, DomainTab } from "@/config/domainFilters";

export const buildTermDirectoryParams = (
  page?: number,
  per_page?: number,
  search?: string,
  domain?: DomainTab,
  collections?: string[],
  sort?: string,
) => {
  const params = new URLSearchParams({
    page: String(page),
    per_page: String(per_page),
  });

  if (search) {
    params.set("concept_name", search);
    params.set("concept_id", search);
  }

  if (domain) {
    const domainIds = DOMAIN_TAB_FILTERS[domain] ?? [];

    if (domainIds.length > 1) {
      params.set("domain_id__in", domainIds.join(","));
    } else if (domainIds.length === 1) {
      params.set("domain_id", domainIds[0]);
    }
  }

  collections?.forEach((pid) => params.append("collection_pid[]", pid));

  if (sort) {
    params.set("sort", sort);
  }

  return params;
};
