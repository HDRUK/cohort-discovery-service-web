import { Collection } from "@/types/api";

const getAllowedCollections = (
  collections: Collection[],
  includeSynthetic = false,
): Collection[] => {
  if (includeSynthetic) return collections;
  return collections.filter((collection) => !collection.is_synthetic);
};

const getAllowedDatasetIds = (
  collections: Collection[],
  includeSynthetic = false,
): string[] => {
  return getAllowedCollections(collections, includeSynthetic).map(
    (collection) => collection.pid,
  );
};

const addPids = (current: string[], pidsToAdd: string[]) =>
  Array.from(new Set([...current, ...pidsToAdd]));

const removePids = (current: string[], pidsToRemoveSet: Set<string>) =>
  current.filter((pid) => !pidsToRemoveSet.has(pid));

export { getAllowedCollections, getAllowedDatasetIds, addPids, removePids };
