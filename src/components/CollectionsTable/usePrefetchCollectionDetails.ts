import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getCollectionDetailsBulk } from "@/actions/collection/getCollectionDetails";
import { QUERY_KEYS } from "@/config/tags";

type Props = {
  pids: string[];
};

const usePrefetchCollectionDetails = ({ pids }: Props) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!pids.length) return;

    let cancelled = false;

    const prefetch = async () => {
      const missingPids = pids.filter(
        (pid) => !queryClient.getQueryData(QUERY_KEYS.collectionDetails(pid)),
      );

      if (!missingPids.length) return;
      const detailsMap = await getCollectionDetailsBulk(missingPids);
      if (cancelled) return;

      for (const [pid, details] of Object.entries(detailsMap)) {
        queryClient.setQueryData(QUERY_KEYS.collectionDetails(pid), details);
      }
    };

    void prefetch();

    return () => {
      cancelled = true;
    };
  }, [pids, queryClient]);

  return null;
};

export default usePrefetchCollectionDetails;
