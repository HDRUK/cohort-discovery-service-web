"use client";

import { Paper } from "@mui/material";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import { Option } from "@/types/common";
import Popper from "@mui/material/Popper";
import List from "@/components/List";
import { RuleGroupType } from "@/types/rules";
import { Query } from "@/types/api";
import { queryToText } from "@/utils/queryBuilder";

type Props = {
  queries: Query[];
  options: (Option & { rules: RuleGroupType })[];
  anchorEl: HTMLElement | null;
  open: boolean;
};
const SearchOverlay = ({ queries, options, anchorEl, open }: Props) => {
  const setQueryBuilderJson = useQueryBuilder((qb) => qb.setQueryBuilderJson);

  return (
    <Popper
      data-testid="search-overlay"
      open={open}
      anchorEl={anchorEl}
      placement="bottom-start"
      modifiers={[{ name: "offset", options: { offset: [0, 4] } }]}
      style={{ zIndex: 2000 }}
    >
      <Paper
        data-testid="search-overlay-paper"
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
                label: opt.label,
                value: opt.rules.id,
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
