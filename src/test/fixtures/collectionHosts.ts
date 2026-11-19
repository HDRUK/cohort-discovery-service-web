import { CollectionHost } from "@/types/api";
import { QueryContext } from "@/types/context";
import { getMockCustodian } from "./custodians";

export const getMockCollectionHost = (
  rest?: Partial<CollectionHost>,
): CollectionHost => ({
  id: 1,
  name: "Test Custodian Host",
  query_context_type: QueryContext.BUNNY,
  custodian: getMockCustodian(),
  collections: [],
  ...rest,
});
