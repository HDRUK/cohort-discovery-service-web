"use client";

import useQueryBuilder from "@/hooks/useQueryBuilder";
import Title from "@/components/Title";
import { useNotify } from "../../providers/NotifyProvider";
import EditableText from "../EditableText";

const CohortQueryTitle = () => {
  const { queryName, setQueryName } = useQueryBuilder((qb) => ({
    queryName: qb.queryName,
    setQueryName: qb.setQueryName,
  }));
  const notify = useNotify();

  return (
    <Title
      title={"Query Name"}
      subTitle={
        <EditableText
          defaultValue={queryName || ""}
          onCommit={(name) => {
            setQueryName(name);
            notify.success("Query name saved");
          }}
          showIcon
          typographyProps={{
            component: "span",
            variant: "h5",
          }}
          textFieldProps={{
            placeholder: "Type query name here",
            variant: "standard",
            size: "small",
            slotProps: {
              input: {
                sx: (theme) => ({
                  fontSize: theme.typography.h5.fontSize,
                  fontWeight: theme.typography.h5.fontWeight,
                  lineHeight: theme.typography.h5.lineHeight,
                }),
              },
            },
          }}
        />
      }
    />
  );
};

export default CohortQueryTitle;
