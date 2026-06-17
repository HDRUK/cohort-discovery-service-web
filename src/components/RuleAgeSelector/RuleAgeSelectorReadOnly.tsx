import { Paper } from "@mui/material";

const RuleAgeSelectorReadOnly = ({
  from,
  to,
  minAge,
  maxAge,
}: {
  from: number;
  to: number;
  minAge: number;
  maxAge: number;
}) => {
  let label: string;

  if (from === minAge && to === maxAge) {
    label = "Any age";
  } else if (from === minAge) {
    label = `Age < ${to}`;
  } else if (to === maxAge) {
    label = `Age ≥ ${from}`;
  } else {
    label = `Age ${from} – ${to}`;
  }

  return (
    <Paper
      sx={{
        border: 1,
        p: 1,
      }}
    >
      {label}
    </Paper>
  );
};

export default RuleAgeSelectorReadOnly;
