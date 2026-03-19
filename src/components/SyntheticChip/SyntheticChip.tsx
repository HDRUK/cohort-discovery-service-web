import { Chip, ChipProps, Tooltip } from "@mui/material";

interface Props extends ChipProps {
  title?: string;
  isSynthetic: boolean;
}

const SyntheticChip = ({
  title = "This collection has been marked as being synthetic data",
  isSynthetic,
  ...rest
}: Props) => {
  return (
    isSynthetic && (
      <Tooltip title={title}>
        <Chip label="S" {...rest} />
      </Tooltip>
    )
  );
};

export default SyntheticChip;
