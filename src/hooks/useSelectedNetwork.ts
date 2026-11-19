import { useNetworks } from "@/contexts/NetworksContext";
import useSearchParams from "@/hooks/useSearchParams";
import { Network } from "@/types/api";
import { selectByIdOrFirst } from "@/utils/selection";

const useSelectedNetwork = (): Network | null => {
  const networks = useNetworks();
  const { getSearchParam } = useSearchParams("network_filter");
  return selectByIdOrFirst(networks, getSearchParam() ?? null);
};

export default useSelectedNetwork;
