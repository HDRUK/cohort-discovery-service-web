import {
  CollectionHost,
  CollectionHostCredentials,
  CollectionHostWithCredentials,
  CollectionWithHosts,
} from "@/types/api";

const parseCollectionHostId = (value: string): number | null => {
  const hostId = Number(value);
  return Number.isInteger(hostId) && hostId > 0 ? hostId : null;
};

const toCollectionHostSummary = ({
  id,
  name,
  query_context_type,
  custodian,
  collections,
  deleted_at,
}: CollectionHost): CollectionHost => ({
  id,
  name,
  query_context_type,
  custodian,
  collections,
  deleted_at,
});

const toCollectionHostCredentials = ({
  id,
  client_id,
  client_secret,
}: CollectionHostWithCredentials): CollectionHostCredentials => ({
  id,
  client_id,
  client_secret,
});

const toCollectionWithHostSummaries = (
  collection: CollectionWithHosts,
): CollectionWithHosts => ({
  ...collection,
  host: collection.host?.map(toCollectionHostSummary),
});

const primaryHost = (collection: CollectionWithHosts): CollectionHost | null =>
  collection.host?.[0] ?? null;

export {
  parseCollectionHostId,
  primaryHost,
  toCollectionHostSummary,
  toCollectionHostCredentials,
  toCollectionWithHostSummaries,
};
