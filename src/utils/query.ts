import { Query } from "@/types/api";

const getQueryName = (query: Query, short = false) =>
  query.name ?? (short ? query.pid.split("-")[0] : query.pid);

export { getQueryName };
