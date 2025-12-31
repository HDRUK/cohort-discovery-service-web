import { useTheme } from "@mui/material/styles";
import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";

export type SquareRadioIconVariant = "empty" | "checked" | "partial";

export interface SquareRadioIconProps extends SvgIconProps {
  variant?: SquareRadioIconVariant;
}

export const SquareRadioIcon = ({
  variant = "empty",
  ...props
}: SquareRadioIconProps) => {
  const theme = useTheme();
  const isChecked = variant === "checked";
  const isPartial = variant === "partial";

  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <rect
        x={3}
        y={3}
        width={18}
        height={18}
        rx={6}
        fill="none"
        stroke={theme.palette.grey[500]}
        strokeWidth={1}
      />
      {isChecked && (
        <rect x={7} y={7} width={10} height={10} rx={2} fill="currentColor" />
      )}
      {isPartial && (
        <rect x={6} y={9} width={12} height={6} rx={2} fill="currentColor" />
      )}
    </SvgIcon>
  );
};
