import {
  CollectionHostCredentials,
  CollectionHostWithCredentials,
} from "@/types/api";

const parseCollectionHostId = (value: string): number | null => {
  const hostId = Number(value);
  return Number.isInteger(hostId) && hostId > 0 ? hostId : null;
};

const toCollectionHostCredentials = ({
  id,
  client_id,
  client_secret,
}: CollectionHostWithCredentials): CollectionHostCredentials => ({
  id,
  client_id,
  client_secret,
});

export { parseCollectionHostId, toCollectionHostCredentials };
