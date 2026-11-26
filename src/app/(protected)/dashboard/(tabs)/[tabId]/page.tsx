import { Skeleton } from "@mui/material";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { QueryHistorySearchParams } from "@/types/api";
import QueryResultsPage from "../components/QueryResultsPage";
import { resultPidFrom } from "../dashboardTabs";

interface DashboardResultPageProps {
  params: Promise<{ tabId: string }>;
  searchParams: Promise<QueryHistorySearchParams>;
}

const DashboardResultContent = async ({
  params,
  searchParams,
}: DashboardResultPageProps) => {
  const { tabId } = await params;
  if (!resultPidFrom(tabId)) notFound();

  return <QueryResultsPage searchParams={searchParams} />;
};

const DashboardResultPage = (props: DashboardResultPageProps) => (
  <Suspense fallback={<Skeleton height={600} />}>
    <DashboardResultContent {...props} />
  </Suspense>
);

export default DashboardResultPage;
