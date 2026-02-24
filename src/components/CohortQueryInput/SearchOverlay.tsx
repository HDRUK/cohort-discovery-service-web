"use client";

import { Paper } from "@mui/material";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import Popper from "@mui/material/Popper";
import List from "@/components/List";
import { Query } from "@/types/api";
import { queryToText } from "@/utils/queryBuilder";
import { EXAMPLES } from "@/config/queryExamples";

type Props = {
  queries: Query[];
  anchorEl: HTMLElement | null;
  open: boolean;
};
const SearchOverlay = ({ queries, anchorEl, open }: Props) => {
  const placeholders = Object.keys(EXAMPLES);
  const options = placeholders.map((label) => ({
    label,
    rules: EXAMPLES[label],
  }));

  const setQueryBuilderJson = useQueryBuilder((qb) => qb.setQueryBuilderJson);

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="bottom-start"
      modifiers={[{ name: "offset", options: { offset: [0, 4] } }]}
      style={{ zIndex: 2000 }}
    >
      <Paper
        sx={{
          width: anchorEl?.clientWidth,
          boxShadow: 3,
          borderRadius: 1,
          p: 1,
        }}
      >
        <List
          items={[
            {
              label: "Query Examples",
              items: options.map((opt) => ({
                id: opt.rules.id,
                label: opt.label,
                value: opt.rules.name,
                onClick: () => setQueryBuilderJson(opt.rules),
              })),
            },
            {
              label: "Recent Searches",
              items: queries.map((q) => ({
                id: q.id,
                label: queryToText(q.definition),
                value: q.name,
                onClick: () => setQueryBuilderJson(q.definition),
              })),
            },
          ]}
        />
      </Paper>
    </Popper>
  );
};

export default SearchOverlay;
