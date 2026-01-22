"use server";

import { Skeleton } from "@mui/material";
import { Suspense } from "react";
import CohortBuilder from "./CohortBuilder";

type PageSearchParams = { query?: string; open_queries?: string };

const NewQueryPage = async (props: PageSearchParams) => {
  return (
    <Suspense fallback={<Skeleton height={600} />}>
      <CohortBuilder {...props} />
    </Suspense>
  );
};

export default NewQueryPage;
