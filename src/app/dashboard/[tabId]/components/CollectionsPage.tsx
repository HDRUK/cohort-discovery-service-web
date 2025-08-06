"use server";

import Collections from "@/components/Collections";
import getCollections from "@/actions/getCollections";
import { Skeleton } from "@mui/material";
import { Suspense } from "react";
import { RevalidateButton } from "./RevalidateButton";

const CollectionsPageContent = async () => {
  const collections = await getCollections();
  return <Collections collections={collections.data} />;
};

const CollectionsPage = async () => {
  return (
    <>
      <Suspense fallback={<Skeleton />}>
        <CollectionsPageContent />
      </Suspense>
      <RevalidateButton tag={"collections"} />
    </>
  );
};

export default CollectionsPage;
