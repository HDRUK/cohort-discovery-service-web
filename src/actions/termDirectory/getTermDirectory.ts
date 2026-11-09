"use server";

import { getTermDirectory as readTermDirectory } from "@/server/data/termDirectory";
import { DEFAULT_PER_PAGE } from "@/config/defaults";
import { DomainTab } from "@/config/domainFilters";
import { ApiResponse, Paginated, TermDirectoryEntry } from "@/types/api";

const getTermDirectory = async (
  page = 1,
  per_page = DEFAULT_PER_PAGE,
  search?: string,
  domain?: DomainTab,
  collections?: string[],
  sort?: string,
): Promise<ApiResponse<Paginated<TermDirectoryEntry>>> =>
  readTermDirectory(page, per_page, search, domain, collections, sort);

export default getTermDirectory;
