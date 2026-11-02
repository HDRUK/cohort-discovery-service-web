import { Paper, Stack } from "@mui/material";
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

const TermDirectoryTitle = async ({ searchParams }: PageProps) => {
  const params = await searchParams;

  return (
    <Title
      title="Term Directory"
      subTitle={
        params?.domain &&
        capitaliseFirstLetter(getDomainPhrase(params.domain).noun)
      }
    />
  );
};

const TermDirectoryPage = ({ searchParams }: PageProps) => {
  const entriesPromise = searchParams
    .then((params) =>
      getTermDirectory(
        params?.page,
        params?.per_page,
        params?.search_term,
        params?.domain,
        params?.collections?.split(","),
        params?.sort,
      ),
    )
    .then((result) => result.data);

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
        <Suspense fallback={<Title title="Term Directory" />}>
          <TermDirectoryTitle searchParams={searchParams} />
        </Suspense>
        <CollectionFilter />
      </Stack>
      <TermDirectory entriesPromise={entriesPromise} />
    </Paper>
  );
};

export default TermDirectoryPage;
