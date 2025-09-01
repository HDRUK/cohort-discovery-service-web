"use client";

import CodeBlock from "@/components/CodeBlock";
import { useDaphneStore } from "@/store/useDaphneStore";
import { getSql } from "@/utils/queryBuilder";

const SqlCohortBuilder = () => {
  const {
    queryBuilder: { queryBuilderJson },
  } = useDaphneStore();

  const sql = getSql(queryBuilderJson);
  return <CodeBlock code={sql} language="sql" />;
};

export default SqlCohortBuilder;
