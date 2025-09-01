"use client";

import CodeBlock from "@/components/CodeBlock";
import { useDaphneStore } from "@/store/useDaphneStore";

const JsonCohortBuilder = () => {
  const {
    queryBuilder: { queryBuilderJson },
  } = useDaphneStore();
  return <CodeBlock code={queryBuilderJson} />;
};

export default JsonCohortBuilder;
