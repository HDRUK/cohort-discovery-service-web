"use server";

import { Skeleton } from "@mui/material";
import { Suspense } from "react";
import CohortBuilder from "./CohortBuilder";

const NewQueryPage = async () => {
  return (
    <Suspense fallback={<Skeleton height={600} />}>
      <CohortBuilder />
    </Suspense>
  );
};

export default NewQueryPage;
