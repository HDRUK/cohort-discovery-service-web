"use server";

import { Suspense } from "react";
import { RevalidateButton } from "./RevalidateButton";
import getQueries from "@/actions/getQueries";
import QueriesTable from "@/components/QueriesTable";
import { QueriesTableSkeleton } from "@/components/QueriesTable";
import { getAllFields } from "@/actions/omop/getAllCodes";

const QueryListPageContent = async () => {
  const queries = await getQueries();
  const fields = await getAllFields();

  return (
    <QueriesTable
      queries={queries.data}
      hasIncomplete={queries.hasIncomplete}
      fields={fields}
    />
  );
};

const QueryListPage = async () => {
  return (
    <>
      <RevalidateButton tag="queries" />
      <Suspense fallback={<QueriesTableSkeleton />}>
        <QueryListPageContent />
      </Suspense>
    </>
  );
};

export default QueryListPage;
