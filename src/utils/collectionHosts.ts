import {
  CollectionHost,
  CollectionHostCredentials,
  CollectionHostWithCredentials,
  Custodian,
} from "@/types/api";

const parseCollectionHostId = (value: string): number | null => {
  const hostId = Number(value);
  return Number.isInteger(hostId) && hostId > 0 ? hostId : null;
};

const toCustodianSummary = ({
  id,
  pid,
  name,
  external_custodian_id,
  external_custodian_name,
  network,
  created_at,
  updated_at,
}: Custodian): Custodian => ({
  id,
  pid,
  name,
  external_custodian_id,
  external_custodian_name,
  network,
  created_at,
  updated_at,
});

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
  custodian: custodian && toCustodianSummary(custodian),
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

export {
  parseCollectionHostId,
  toCustodianSummary,
  toCollectionHostSummary,
  toCollectionHostCredentials,
};
