"use server";

import { Suspense } from "react";
import getQueries from "@/actions/getQueries";
import QueriesTable from "@/components/QueriesTable";
import { QueriesTableSkeleton } from "@/components/QueriesTable";
import { Paper } from "@mui/material";
import Title from "@/components/Title";
import RevalidateButton from "@/components/RevalidateButton";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    per_page?: string;
  }>;
}

const QueryListPageContent = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const page = params?.page ? parseInt(params.page) : undefined;
  const perPage = params?.per_page ? parseInt(params.per_page) : undefined;

  const queries = await getQueries(page, perPage);

  return (
    <Paper sx={{ p: 2, gap: 2, display: "flex", flexDirection: "column" }}>
      <Title title={"History"} subTitle={queries.data.total}>
        <RevalidateButton tag="queries" />
      </Title>
      <QueriesTable
        queries={queries.data}
        hasIncomplete={queries.hasIncomplete}
      />
    </Paper>
  );
};

const QueryListPage = async ({ searchParams }: PageProps) => {
  return (
    <>
      <Suspense fallback={<QueriesTableSkeleton />}>
        <QueryListPageContent searchParams={searchParams} />
      </Suspense>
    </>
  );
};

export default QueryListPage;
