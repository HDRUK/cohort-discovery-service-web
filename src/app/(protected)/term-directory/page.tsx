import { Paper, Skeleton } from "@mui/material";
import { Suspense } from "react";
import Title from "@/components/Title";
import TermDirectory from "@/modules/TermDirectory";
import getTermDirectory from "@/actions/termDirectory/getTermDirectory";
import { ApiSearchParams } from "@/types/api";

interface PageProps {
  searchParams: Promise<ApiSearchParams>;
}

const TermDirectoryPageContent = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const result = await getTermDirectory(
    params?.page,
    params?.per_page,
    params?.search_term,
  );

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
