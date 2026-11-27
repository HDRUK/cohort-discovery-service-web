import { Custodian, NetworkCustodiansSearchParams } from "@/types/api";
import { buildNetworkCustodianParams } from "@/utils/params";
import { selectByIdOrFirst } from "@/utils/selection";
import { emptyPaginated } from "@/utils/pagination";
import NetworksAdmin from "./NetworksAdmin";
import { getNetworkCustodians, getNetworks } from "@/server/data/networks";

const NetworksTab = async ({
  searchParams,
}: {
  searchParams: Promise<NetworkCustodiansSearchParams>;
}) => {
  const [params, { data: networks }] = await Promise.all([
    searchParams,
    getNetworks(),
  ]);

  const selectedNetwork = selectByIdOrFirst(
    networks ?? [],
    params.network_filter ?? null,
  );

  const custodians = selectedNetwork
    ? (
        await getNetworkCustodians(
          selectedNetwork.id,
          buildNetworkCustodianParams(params),
        )
      ).data
    : emptyPaginated<Custodian>([]);

  return <NetworksAdmin networks={networks ?? []} custodians={custodians} />;
};

export default NetworksTab;
