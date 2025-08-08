"use client";

import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { ActionWithRulesProps } from "react-querybuilder";

const AddGroupAction = ({ handleOnClick }: ActionWithRulesProps) => {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleOnClick}
      startIcon={<Add />}
    >
      Add Group
    </Button>
  );
};

export default AddGroupAction;
