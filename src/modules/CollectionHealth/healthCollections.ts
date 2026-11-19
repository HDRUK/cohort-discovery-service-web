export const COLLECTIONS_PER_PAGE = "500";

export const collectionsParams = (pid?: string) =>
  new URLSearchParams(pid ? { pid } : { per_page: COLLECTIONS_PER_PAGE });
