import { Paper, Skeleton } from "@mui/material";
import { Suspense } from "react";
import Title from "@/components/Title";
import TermDirectory from "@/modules/TermDirectory";
import getTermDirectory from "@/actions/termDirectory/getTermDirectory";

interface PageProps {
  searchParams: Promise<{ page?: string; per_page?: string }>;
}

const TermDirectoryPageContent = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const page = params?.page ? parseInt(params.page) : undefined;
  const perPage = params?.per_page ? parseInt(params.per_page) : undefined;
  const result = await getTermDirectory(page, perPage);

  return (
    <Paper sx={{ p: 2, gap: 2, display: "flex", flexDirection: "column" }}>
      <Title title="Term Directory" subTitle={result.data.total} />
      <TermDirectory entries={result.data} />
    </Paper>
  );
};

const TermDirectoryPage = ({ searchParams }: PageProps) => (
  <Suspense fallback={<Skeleton variant="rectangular" height={400} />}>
    <TermDirectoryPageContent searchParams={searchParams} />
  </Suspense>
);

export default TermDirectoryPage;
