"use server";

import { Suspense } from "react";
import { RevalidateButton } from "./RevalidateButton";
import getQueries from "@/actions/getQueries";
import QueriesTable from "@/components/QueriesTable";
import { QueriesTableSkeleton } from "@/components/QueriesTable";
import { getAllFields } from "@/actions/omop/getAllCodes";

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
  const fields = await getAllFields();

  return (
    <QueriesTable
      queries={queries.data}
      hasIncomplete={queries.hasIncomplete}
      fields={fields}
    />
  );
};

const QueryListPage = async ({ searchParams }: PageProps) => {
  return (
    <>
      <RevalidateButton tag="queries" />
      <Suspense fallback={<QueriesTableSkeleton />}>
        <QueryListPageContent searchParams={searchParams} />
      </Suspense>
    </>
  );
};

export default QueryListPage;
