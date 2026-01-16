"use client";

import { Button } from "@mui/material";
import useSubmitQuery from "@/hooks/useSubmitQuery";

const SubmitQueryButton = () => {
  const { submit, disabled } = useSubmitQuery();

  return (
    <Button
      component="span"
      variant="outlined"
      disabled={disabled}
      sx={(theme) => ({
        borderRadius: 20,
        borderWidth: 1,

        borderColor: theme.palette.text.secondary,
        backgroundColor: !disabled
          ? theme.palette.common.white
          : theme.palette.background.default,
        color: theme.palette.text.primary,

        fontWeight: 500,
        fontSize: 15,

        "&:hover": {
          borderWidth: 1,
          borderColor: "transparent",
          backgroundColor: theme.palette.action.hover,
        },

        "&.Mui-disabled": {
          borderWidth: 1,
          borderColor: theme.palette.action.disabledBackground,
          color: theme.palette.text.disabled,
          backgroundColor: "transparent",
        },
      })}
      onClick={(event) => {
        event.stopPropagation();
        event.preventDefault();
        submit();
      }}
    >
      Run Query
    </Button>
  );
};

export default SubmitQueryButton;
