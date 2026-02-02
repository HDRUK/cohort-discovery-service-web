import Switch from "@/components/Switch";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import { RuleLeafType } from "@/types/rules";
import { FormControlLabel, Stack } from "@mui/material";

type ShowDescendantsProps = {
  node: RuleLeafType;
};

const ShowDescendants = ({ node }: ShowDescendantsProps) => {
  const { showDescendants, setShowDescendants } = useQueryBuilder((qb) => ({
    showDescendants: qb.showDescendants,
    setShowDescendants: qb.setShowDescendants,
  }));

  return (
    <Stack direction="row" justifyContent="flex-start">
      <FormControlLabel
        sx={{ p: 0, m: 0 }}
        labelPlacement="start"
        value="showDescendants"
        control={
          <Switch
            checked={showDescendants[node.id] ?? false}
            onChange={() =>
              setShowDescendants(node.id, !showDescendants[node.id])
            }
          />
        }
        label="Show Descendants"
      />
    </Stack>
  );
};

export default ShowDescendants;
