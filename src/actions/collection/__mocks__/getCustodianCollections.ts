import { ApiResponse, CollectionWithHosts, Paginated } from "@/types/api";
import { getMockCollections } from "./getCollections";
import { paginateData } from "@/utils/mock";
import getCollectionHost from "../../collectionHost/__mocks__/getCollectionHost";

const getCustodianCollections = async (
  _custodianPid: string,
): Promise<ApiResponse<Paginated<CollectionWithHosts>>> => {
  const collectionWithHost = getMockCollections().map((c) => ({
    ...c,
    host: getCollectionHost(),
  })) as CollectionWithHosts[];

  return {
    data: paginateData({ data: collectionWithHost }),
    message: "success",
  };
};

export default getCustodianCollections;
