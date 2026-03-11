"use client";

import { Button } from "@mui/material";
import useQueryBuilder from "@/hooks/useQueryBuilder";

const ClearQueryButton = () => {
  const resetQueryBuilderJson = useQueryBuilder(
    (qb) => qb.resetQueryBuilderJson,
  );
  const disabled = useQueryBuilder(
    (qb) => qb.queryBuilderJson.rules.length === 0,
  );

  return (
    <Button
      component="span"
      variant="contained"
      sx={() => ({
        borderRadius: 20,
        borderWidth: 2,
        whiteSpace: "nowrap",
        fontWeight: 400,
        fontSize: 15,
        bgcolor: "white",
        color: "text.primary",
        boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.23)",
        pointerEvents: disabled ? "none" : "auto",
        opacity: disabled ? 0.5 : 1,
      })}
      onClick={() => {
        resetQueryBuilderJson(true);
      }}
    >
      Clear Query
    </Button>
  );
};

export default ClearQueryButton;
