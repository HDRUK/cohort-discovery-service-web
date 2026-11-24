import "server-only";

export const USER_DATA_CACHE_LIFE = {
  stale: 300,
  revalidate: 300,
  expire: 3600,
};

export const LIST_CACHE_LIFE = {
  stale: 300,
  revalidate: 300,
  expire: 3600,
};

export const FEATURE_FLAGS_CACHE_LIFE = {
  stale: 30,
  revalidate: 30,
  expire: 300,
};
