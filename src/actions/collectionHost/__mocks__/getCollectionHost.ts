import { CollectionHost } from "@/types/api";
import { QueryContext } from "@/types/context";
import getCustodian from "../../custodian/__mocks__/getCustodian";

export const getCollectionHost = (
  rest?: Partial<CollectionHost>,
): CollectionHost => ({
  id: 1,
  name: "Test Custodian Host",
  query_context_type: QueryContext.BUNNY,
  custodian: getCustodian(),
  collections: [],
  ...rest,
});

export default getCollectionHost;
