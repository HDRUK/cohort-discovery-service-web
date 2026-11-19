"use client";

import { Skeleton } from "@mui/material";
import { skipToken, useQuery } from "@tanstack/react-query";
import Title from "@/components/Title";
import { QUERY_KEYS } from "@/config/tags";
import useSearchParams from "@/hooks/useSearchParams";
import { Paginated, Query } from "@/types/api";

const QueryHistoryTitle = ({ total }: { total?: number }) => {
  const { searchParams } = useSearchParams();
  const { data } = useQuery<Paginated<Query>>({
    queryKey: QUERY_KEYS.queries(searchParams.toString()),
    queryFn: skipToken,
  });

  const count = data?.total ?? total;

  return (
    <Title
      title="History"
      subTitle={
        count === undefined ? (
          <Skeleton
            variant="text"
            width={40}
            sx={{ display: "inline-block" }}
          />
        ) : (
          `${count}`
        )
      }
    />
  );
};

export default QueryHistoryTitle;
