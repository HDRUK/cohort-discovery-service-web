import Radio, { radioClasses } from "@mui/material/Radio";
import { SquareRadioIcon } from "@/assets/icons/SquareRadioIcon";

type SquareRadioIconVariant = "empty" | "checked" | "partial";

interface SquareRadioProps extends React.ComponentProps<typeof Radio> {
  partial?: boolean;
}

const SquareRadio = ({ partial = false, ...props }: SquareRadioProps) => {
  const variant: SquareRadioIconVariant = partial ? "partial" : "checked";

  return (
    <Radio
      icon={<SquareRadioIcon variant="empty" />}
      checkedIcon={<SquareRadioIcon variant={variant} />}
      disableRipple
      sx={{
        "&.Mui-checked": { color: "primary.main" },
        [`& .${radioClasses.root}`]: { p: 0.5 },
      }}
      {...props}
    />
  );
};

export default SquareRadio;
