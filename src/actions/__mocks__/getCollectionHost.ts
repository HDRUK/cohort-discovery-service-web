import { CollectionHost } from "@/types/api";
import { QueryContext } from "@/types/context";
import { v4 as uuidv4 } from "uuid";

export const getCollectionHost = (
  rest?: Partial<CollectionHost>
): CollectionHost => ({
  id: 1,
  name: "Test Custodian Host",
  query_context_type: QueryContext.BUNNY,
  client_id: uuidv4(),
  client_secret: uuidv4(),
  ...rest,
});

export default getCollectionHost;
