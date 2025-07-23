"use client";

import { useEffect, useState } from "react";
import { Field, QueryBuilder as ReactQueryBuilder } from "react-querybuilder";
import "react-querybuilder/dist/query-builder.css";
import { useDaphneStore } from "../store/useDaphneStore";
import { Skeleton, Box } from "@mui/material";

const fields: Field[] = [
  {
    name: "sex",
    label: "Sex",
    valueEditorType: "select",
    operators: ["=", "!="],
    values: [
      { name: "Male", label: "Male" },
      { name: "Female", label: "Female" },
      { name: "Other", label: "Other" },
    ],
  },
  {
    name: "age",
    label: "Age",
    inputType: "number", // supports numeric input
    operators: ["=", ">", "<", ">=", "<=", "between"], // optional: restrict allowed operators
  },
];

const QueryBuilderSkeleton = () => (
  <Box sx={{ p: 2 }}>
    <Skeleton variant="rectangular" height={100} width="100%" sx={{ mb: 2 }} />
  </Box>
);

const QueryBuilder = () => {
  const { query, setQuery } = useDaphneStore();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <QueryBuilderSkeleton />;
  }

  return (
    <ReactQueryBuilder
      fields={fields}
      query={query}
      onQueryChange={setQuery}
      addRuleToNewGroups
      debugMode
      listsAsArrays
      parseNumbers="strict-limited"
      showCloneButtons
      showLockButtons
      showNotToggle
      controlClassnames={{
        queryBuilder: "queryBuilder-branches queryBuilder-justified",
      }}
    />
  );
};

export default QueryBuilder;
