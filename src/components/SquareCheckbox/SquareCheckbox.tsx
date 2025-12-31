import { Checkbox, CheckboxProps } from "@mui/material";
import { SquareRadioIcon } from "@/assets/icons/SquareRadioIcon";

const SquareCheckbox = ({ ...props }: CheckboxProps) => {
  return (
    <Checkbox
      icon={<SquareRadioIcon variant="empty" />}
      checkedIcon={<SquareRadioIcon variant={"checked"} />}
      indeterminateIcon={<SquareRadioIcon variant={"partial"} />}
      disableRipple
      onClick={(e) => {
        e.stopPropagation();
      }}
      {...props}
    />
  );
};

export default SquareCheckbox;
