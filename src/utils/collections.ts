import { Collection } from "@/types/api";

const getAllowedDatasetIds = (
  collections: Collection[],
  includeSynthetic: boolean,
) => {
  return collections
    .filter((c) => includeSynthetic || !c.is_synthetic)
    .map((c) => c.pid);
};

export { getAllowedDatasetIds };
