"use server";

import Collections from "@/components/Collections";
import getCollections from "@/actions/getCollections";
import { Paper, Skeleton } from "@mui/material";
import { Suspense } from "react";
import RevalidateButton from "@/components/RevalidateButton";
import Title from "@/components/Title";

const CollectionsPageContent = async () => {
  const collections = await getCollections();
  return (
    <Paper sx={{ p: 2, gap: 2, display: "flex", flexDirection: "column" }}>
      <Title title={"Collections"} subTitle={collections.data.length}>
        <RevalidateButton tag="collections" />
      </Title>
      <Collections collections={collections.data} />
    </Paper>
  );
};

const CollectionsPage = async () => {
  return (
    <>
      <Suspense fallback={<Skeleton />}>
        <CollectionsPageContent />
      </Suspense>
    </>
  );
};

export default CollectionsPage;
