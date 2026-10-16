"use client";

import { Button, Tooltip } from "@mui/material";
import useSubmitQuery from "@/hooks/useSubmitQuery";
import useQueryBuilder from "@/hooks/useQueryBuilder";

const SubmitQueryButton = ({ warning = false }: { warning: boolean }) => {
  const { submit, disabled, disabledReason } = useSubmitQuery();

  const { resetQueryBuilderJson } = useQueryBuilder((qb) => ({
    resetQueryBuilderJson: qb.resetQueryBuilderJson,
  }));

  return (
    <Tooltip title={disabledReason ?? ""}>
      <span>
        <Button
          component="span"
          variant="outlined"
          disabled={disabled}
          sx={(theme) => ({
            borderRadius: 20,
            borderWidth: 2,
            whiteSpace: "nowrap",

            borderColor: warning
              ? theme.palette.warning.main
              : theme.palette.success.main,
            backgroundColor: !disabled
              ? theme.palette.common.white
              : theme.palette.background.default,
            color: theme.palette.text.primary,

            fontWeight: 400,
            fontSize: 15,

            "&.Mui-disabled": {
              borderWidth: 2,
              borderColor: theme.palette.grey[300],
              color: theme.palette.text.secondary,
              backgroundColor: theme.palette.grey[200],
            },
          })}
          onClick={async (event) => {
            event.stopPropagation();
            event.preventDefault();
            const succeeded = await submit();
            if (succeeded) resetQueryBuilderJson(true);
          }}
        >
          Run Query
        </Button>
      </span>
    </Tooltip>
  );
};

export default SubmitQueryButton;
