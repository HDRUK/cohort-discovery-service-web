"use client";

import { useEffect, useState } from "react";
import {
  Field,
  formatQuery,
  QueryBuilder as ReactQueryBuilder,
  RuleGroupType,
} from "react-querybuilder";

import "react-querybuilder/dist/query-builder.css";
import { useDaphneStore } from "../store/useDaphneStore";
import { Button } from "@mui/material";

const fields: Field[] = [
  { name: "firstName", label: "First Name" },
  { name: "lastName", label: "Last Name" },
];

const QueryBuilder = () => {
  const { query, setQuery, getQuery } = useDaphneStore();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    if (!hasMounted) {
      setHasMounted(true);
    }
  }, [hasMounted]);

  return (
    hasMounted && (
      <>
        <ReactQueryBuilder
          fields={fields}
          query={query}
          onQueryChange={setQuery}
        />
        <Button onClick={getQuery}> Click me cunt</Button>
      </>
    )
  );
};

export default QueryBuilder;
