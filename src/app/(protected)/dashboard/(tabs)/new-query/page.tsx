import { Skeleton } from "@mui/material";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { isPathSegment } from "@/lib/apiRoutes";
import { SearchParams } from "@/types/api";
import NewQueryPage from "../components/NewQueryPage";

interface DashboardNewQueryPageProps {
  searchParams: Promise<SearchParams>;
}

const NewQueryContent = async ({
  searchParams,
}: DashboardNewQueryPageProps) => {
  const { query, open_queries: openQueries } = await searchParams;
  if (query && !isPathSegment(query as string)) notFound();

  return (
    <NewQueryPage
      query={query as string}
      open_queries={(openQueries ?? "").toString()}
    />
  );
};

const DashboardNewQueryPage = ({
  searchParams,
}: DashboardNewQueryPageProps) => (
  <Suspense fallback={<Skeleton height={600} />}>
    <NewQueryContent searchParams={searchParams} />
  </Suspense>
);

export default DashboardNewQueryPage;
