"use server";

import { Skeleton } from "@mui/material";
import { Suspense } from "react";
import CohortBuilder from "./CohortBuilder";

type PageSearchParams = { query?: string; open_queries?: string };

const NewQueryPage = async (props: PageSearchParams) => {
  console.log(
    "NewQueryPage props",
    props,
    "open_queries",
    props.open_queries,
    typeof props.open_queries,
    JSON.parse(props.open_queries || "[]")
  );
  return (
    <Suspense fallback={<Skeleton height={600} />}>
      <CohortBuilder {...props} />
    </Suspense>
  );
};

export default NewQueryPage;
