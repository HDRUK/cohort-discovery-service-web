import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import getCollectionDetails from "@/actions/collection/getCollectionDetails";

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
        (pid) => !queryClient.getQueryData(["collectionDetails", pid]),
      );

      if (!missingPids.length) return;

      const detailsMap = Object.fromEntries(
        await Promise.all(
          missingPids.map(async (pid) => {
            const res = await getCollectionDetails(pid);
            return [pid, res.data];
          }),
        ),
      );

      if (cancelled) return;

      for (const [pid, details] of Object.entries(detailsMap)) {
        queryClient.setQueryData(["collectionDetails", pid], details);
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
