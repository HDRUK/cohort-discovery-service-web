"use server";

import CodeStats from "@/components/CodeStats";
import { Paper, Skeleton } from "@mui/material";
import { Suspense } from "react";
import RefreshButton from "@/components/RefreshButton";
import Title from "@/components/Title";
import getCodeStats from "@/actions/omop/getCodeStats";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    per_page?: string;
  }>;
}

const CodesPageContent = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const page = params?.page ? parseInt(params.page) : undefined;
  const perPage = params?.per_page ? parseInt(params.per_page) : undefined;
  // to-do:
  // - implement sending sort/filters too when implemented on BE
  const stats = await getCodeStats(page, perPage);

  return (
    <Paper sx={{ p: 2, gap: 2, display: "flex", flexDirection: "column" }}>
      <Title title={"Available Codes"} subTitle={stats.data.total}>
        <RefreshButton tag="omop" />
      </Title>
      <CodeStats codes={stats.data} />
    </Paper>
  );
};

const CodesPage = async ({ searchParams }: PageProps) => {
  return (
    <>
      <Suspense fallback={<Skeleton />}>
        <CodesPageContent searchParams={searchParams} />
      </Suspense>
    </>
  );
};

export default CodesPage;
