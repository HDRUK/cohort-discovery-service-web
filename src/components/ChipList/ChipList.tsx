import { Chip, Stack } from "@mui/material";
import { ChipProps } from "@mui/material/Chip";

export interface ChipListProps {
  labels: string[];
  colour?: ChipProps["color"];
  emptyLabel?: string;
}

const ChipList = ({ labels, colour, emptyLabel = "—" }: ChipListProps) => {
  if (!labels.length) {
    return <>{emptyLabel}</>;
  }

  return (
    <Stack direction="row" gap={0.5} useFlexGap flexWrap="wrap">
      {labels.map((label) => (
        <Chip key={label} label={label} color={colour} size="small" />
      ))}
    </Stack>
  );
};

export default ChipList;
