import AddIcon from "@mui/icons-material/Add";
import { Chip, Stack } from "@mui/material";
import { Concept } from "@/types/api";

const RuleGenderSelectorReadOnly = ({ concepts }: { concepts: Concept[] }) => {
  if (concepts.length === 0) {
    return (
      <Chip
        icon={<AddIcon />}
        label="Add sex"
        variant="outlined"
        sx={{ py: 2, borderRadius: 10, borderStyle: "dashed" }}
      />
    );
  }

  return (
    <Stack direction="row" flexWrap="wrap" gap={1}>
      {concepts.map((c) => (
        <Chip
          key={c.concept_id}
          label={c.name}
          variant="outlined"
          sx={{ py: 2, borderRadius: 10 }}
        />
      ))}
    </Stack>
  );
};

export default RuleGenderSelectorReadOnly;
