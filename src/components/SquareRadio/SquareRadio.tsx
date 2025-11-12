import * as React from "react";
import Radio, { radioClasses } from "@mui/material/Radio";
import { useTheme } from "@mui/material/styles";
import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";

interface SquareRadioIconProps extends SvgIconProps {
  filled?: boolean;
}

function SquareRadioIcon({ filled, ...props }: SquareRadioIconProps) {
  const theme = useTheme();
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
      {filled && (
        <rect x={6} y={9} width={12} height={6} rx={2} fill="currentColor" />
      )}
    </SvgIcon>
  );
}

export default function SquareRadio(props: React.ComponentProps<typeof Radio>) {
  return (
    <Radio
      icon={<SquareRadioIcon />}
      checkedIcon={<SquareRadioIcon filled={true} />}
      disableRipple
      sx={{
        "&.Mui-checked": { color: "primary.main" },
        [`& .${radioClasses.root}`]: { p: 0.5 },
      }}
      {...props}
    />
  );
}
