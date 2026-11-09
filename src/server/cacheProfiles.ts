import "server-only";

export const USER_DATA_CACHE_LIFE = {
  stale: 300,
  revalidate: 300,
  expire: 3600,
};

export const LIST_CACHE_LIFE = {
  stale: 60,
  revalidate: 60,
  expire: 300,
};
