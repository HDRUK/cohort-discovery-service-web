"use client";

import useQueryBuilder from "@/store/useQueryBuilder";
import { useEffect } from "react";
import Title from "@/components/Title";
import { useNotify } from "../../providers/NotifyProvider";
import EditableText from "../EditableText";

const CohortQueryTitle = () => {
  const { queryName, setQueryName } = useQueryBuilder((qb) => ({
    queryName: qb.queryName,
    setQueryName: qb.setQueryName,
  }));
  const notify = useNotify();

  useEffect(() => {
    return () => {
      setQueryName("");
    };
  }, [setQueryName]);

  return (
    <Title
      title={"New Query"}
      subTitle={
        <EditableText
          value={queryName || ""}
          onCommit={(name) => {
            setQueryName(name);
            notify.success("Query name saved");
          }}
          typographyProps={{
            component: "span",
            variant: "h5",
          }}
          textFieldProps={{
            variant: "standard",
          }}
        />
      }
    />
  );
};

export default CohortQueryTitle;
