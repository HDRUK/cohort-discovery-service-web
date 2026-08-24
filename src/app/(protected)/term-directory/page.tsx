import { Paper, Skeleton, Stack } from "@mui/material";
import { Suspense } from "react";
import Title from "@/components/Title";
import TermDirectory from "@/modules/TermDirectory";
import CollectionFilter from "@/modules/TermDirectory/CollectionFilter";
import getTermDirectory from "@/actions/termDirectory/getTermDirectory";
import { TermDirectorySearchParams } from "@/types/api";
import { getDomainPhrase } from "@/utils/omop";
import { capitaliseFirstLetter } from "@/utils/string";

interface PageProps {
  searchParams: Promise<TermDirectorySearchParams>;
}

const TermDirectoryPageContent = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const result = await getTermDirectory(
    params?.page,
    params?.per_page,
    params?.search_term,
    params?.domain,
    params?.collections?.split(","),
    params?.sort,
  );

  return (
    <Paper
      sx={{
        p: 2,
        gap: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
      >
        <Title
          title="Term Directory"
          subTitle={
            params?.domain &&
            capitaliseFirstLetter(getDomainPhrase(params.domain).noun)
          }
        />
        <CollectionFilter />
      </Stack>
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
