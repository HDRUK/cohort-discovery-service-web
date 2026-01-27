import { CollectionHost } from "@/types/api";
import { QueryContext } from "@/types/context";
import { v4 as uuidv4 } from "uuid";
import getCustodian from "./getCustodian";

export const getCollectionHost = (
  rest?: Partial<CollectionHost>,
): CollectionHost => ({
  id: 1,
  name: "Test Custodian Host",
  query_context_type: QueryContext.BUNNY,
  client_id: uuidv4(),
  client_secret: uuidv4(),
  custodian: getCustodian(),
  ...rest,
});

export default getCollectionHost;
